import natural from "natural";
import { ProductModel } from "../models/ProductModel.js";

const { TfIdf, WordTokenizer, PorterStemmer } = natural;

const tokenizer = new WordTokenizer();

/*
  ----------------------------------------------------
  CONFIGURATION
  ----------------------------------------------------
*/

const MAX_RECOMMENDATIONS = 5;

// Minimum score required for a product to be recommended
const MIN_RECOMMENDATION_SCORE = 25;

// Score weights
const CATEGORY_WEIGHT = 25;
const TITLE_WEIGHT = 30;
const DESCRIPTION_WEIGHT = 25;
const CONDITION_WEIGHT = 10;
const PRICE_WEIGHT = 10;

/*
  ----------------------------------------------------
  STOP WORDS
  ----------------------------------------------------
*/

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "is",
  "am",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "this",
  "that",
  "these",
  "those",
  "with",
  "from",
  "for",
  "you",
  "your",
  "my",
  "our",
  "their",
  "has",
  "have",
  "had",
  "it",
  "its",
  "very",
  "good",
  "like",
  "suitable",
  "used",
]);

/*
  ----------------------------------------------------
  TEXT PREPROCESSING
  ----------------------------------------------------
*/

const preprocessText = (text = "") => {
  const tokens = tokenizer.tokenize(text.toLowerCase().replace(/[^a-z0-9\s]/g, " "));

  return tokens
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
    .map((word) => PorterStemmer.stem(word))
    .join(" ");
};

/*
  ----------------------------------------------------
  TF-IDF VECTOR CREATION
  ----------------------------------------------------
*/

const createTfidfVectors = (documents) => {
  const tfidf = new TfIdf();

  documents.forEach((document) => {
    tfidf.addDocument(document);
  });

  const vectors = [];

  for (let documentIndex = 0; documentIndex < documents.length; documentIndex++) {
    const terms = tfidf.listTerms(documentIndex);

    const vector = {};

    terms.forEach((item) => {
      vector[item.term] = item.tfidf;
    });

    vectors.push(vector);
  }

  return vectors;
};

/*
  ----------------------------------------------------
  COSINE SIMILARITY
  ----------------------------------------------------
*/

const cosineSimilarity = (vectorA, vectorB) => {
  const allTerms = new Set([...Object.keys(vectorA), ...Object.keys(vectorB)]);

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  allTerms.forEach((term) => {
    const valueA = vectorA[term] || 0;
    const valueB = vectorB[term] || 0;

    dotProduct += valueA * valueB;

    magnitudeA += valueA * valueA;
    magnitudeB += valueB * valueB;
  });

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
};

/*
  ----------------------------------------------------
  PRICE SIMILARITY
  ----------------------------------------------------
*/

const calculatePriceSimilarity = (price1, price2) => {
  const firstPrice = Number(price1);
  const secondPrice = Number(price2);

  if (!Number.isFinite(firstPrice) || !Number.isFinite(secondPrice) || firstPrice <= 0 || secondPrice <= 0) {
    return 0;
  }

  const difference = Math.abs(firstPrice - secondPrice);

  const average = (firstPrice + secondPrice) / 2;

  return Math.max(0, 1 - difference / average);
};

/*
  ----------------------------------------------------
  GET RECOMMENDATIONS
  ----------------------------------------------------
*/

export const getRecommendations = async (req, res, next) => {
  try {
    const productId = req.params.pid;

    /*
      ------------------------------------------------
      SELECT TARGET PRODUCT
      ------------------------------------------------
    */

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    /*
      ------------------------------------------------
      CANDIDATE GENERATION
      ------------------------------------------------

      Only active and available products.

      The selected product is explicitly excluded.
    */

    const products = await ProductModel.find({
      _id: { $ne: product._id },
      isActive: true,
      status: "AVAILABLE",
    }).lean();

    if (products.length === 0) {
      return res.status(200).json({
        message: "No recommendations available",
        totalCandidates: 0,
        returnedRecommendations: 0,
        payload: [],
      });
    }

    /*
      ------------------------------------------------
      TEXT PREPARATION
      ------------------------------------------------
    */

    const allProducts = [product.toObject(), ...products];

    const titleDocuments = allProducts.map((item) => preprocessText(item.title));

    const descriptionDocuments = allProducts.map((item) => preprocessText(item.description));

    /*
      ------------------------------------------------
      TF-IDF
      ------------------------------------------------
    */

    const titleVectors = createTfidfVectors(titleDocuments);

    const descriptionVectors = createTfidfVectors(descriptionDocuments);

    /*
      ------------------------------------------------
      CALCULATE SCORES
      ------------------------------------------------
    */

    const recommendations = [];

    products.forEach((item, index) => {
      const candidateIndex = index + 1;

      /*
        ----------------------------------------------
        SAFETY CHECK
        ----------------------------------------------
      */

      if (item._id.toString() === product._id.toString()) {
        return;
      }

      /*
        ----------------------------------------------
        CATEGORY
        ----------------------------------------------
      */

      const categorySimilarity = product.category === item.category ? 1 : 0;

      /*
        ----------------------------------------------
        TITLE TF-IDF
        ----------------------------------------------
      */

      const titleSimilarity = cosineSimilarity(titleVectors[0], titleVectors[candidateIndex]);

      /*
        ----------------------------------------------
        DESCRIPTION TF-IDF
        ----------------------------------------------
      */

      const descriptionSimilarity = cosineSimilarity(descriptionVectors[0], descriptionVectors[candidateIndex]);

      /*
        ----------------------------------------------
        CONDITION
        ----------------------------------------------
      */

      const conditionSimilarity = product.condition === item.condition ? 1 : 0;

      /*
        ----------------------------------------------
        PRICE
        ----------------------------------------------
      */

      const priceSimilarity = calculatePriceSimilarity(product.price, item.price);

      /*
        ----------------------------------------------
        RAW WEIGHTED SCORES
        ----------------------------------------------
      */

      const categoryScore = categorySimilarity * CATEGORY_WEIGHT;

      const titleScore = titleSimilarity * TITLE_WEIGHT;

      const descriptionScore = descriptionSimilarity * DESCRIPTION_WEIGHT;

      const conditionScore = conditionSimilarity * CONDITION_WEIGHT;

      const priceScore = priceSimilarity * PRICE_WEIGHT;

      /*
        ----------------------------------------------
        CATEGORY-AWARE SCORING
        ----------------------------------------------

        Same category:
        Full score is allowed.

        Different category:
        Strongly reduce the contribution of
        condition and price.

        This prevents unrelated products such as
        bicycles from becoming recommendations just
        because their price/condition happens to match.
      */

      let finalScore;

      if (categorySimilarity === 1) {
        finalScore = categoryScore + titleScore + descriptionScore + conditionScore + priceScore;
      } else {
        /*
          For different categories, only meaningful
          textual similarity can contribute strongly.

          Category = 0
          Condition contribution = 0
          Price contribution = 0

          Text similarity is reduced to avoid unrelated
          categories dominating the results.
        */

        finalScore = (titleScore + descriptionScore) * 0.5;
      }

      /*
        ----------------------------------------------
        ROUND SCORE
        ----------------------------------------------
      */

      finalScore = Number(finalScore.toFixed(2));

      /*
        ----------------------------------------------
        STORE CANDIDATE
        ----------------------------------------------
      */

      recommendations.push({
        ...item,

        similarityScore: finalScore,

        similarityDetails: {
          category: Number(categoryScore.toFixed(2)),

          title: Number(titleScore.toFixed(2)),

          description: Number(descriptionScore.toFixed(2)),

          condition: Number(conditionScore.toFixed(2)),

          price: Number(priceScore.toFixed(2)),
        },
      });
    });

    /*
      ------------------------------------------------
      REMOVE LOW-RELEVANCE PRODUCTS
      ------------------------------------------------
    */

    const relevantRecommendations = recommendations.filter((item) => item.similarityScore >= MIN_RECOMMENDATION_SCORE);

    /*
      ------------------------------------------------
      RANK
      ------------------------------------------------
    */

    relevantRecommendations.sort((a, b) => b.similarityScore - a.similarityScore);

    /*
      ------------------------------------------------
      TOP K
      ------------------------------------------------
    */

    const topRecommendations = relevantRecommendations.slice(0, MAX_RECOMMENDATIONS);

    /*
      ------------------------------------------------
      RESPONSE
      ------------------------------------------------
    */

    return res.status(200).json({
      message: topRecommendations.length > 0 ? "Recommendations generated successfully" : "No sufficiently similar products found",

      totalCandidates: products.length,

      relevantCandidates: relevantRecommendations.length,

      returnedRecommendations: topRecommendations.length,

      payload: topRecommendations,
    });
  } catch (err) {
    next(err);
  }
};
