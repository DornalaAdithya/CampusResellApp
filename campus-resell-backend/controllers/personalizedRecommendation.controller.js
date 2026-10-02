import { ProductModel } from "../models/ProductModel.js";
import { UserViewHistoryModel } from "../models/UserViewHistoryModel.js";

const MAX_RECOMMENDATIONS = 5;

export const getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get user's most recent product views
    const viewHistory = await UserViewHistoryModel.find({
      user: userId,
    })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate("product");

    const viewedProducts = viewHistory.map((item) => item.product).filter(Boolean);

    // User has no viewing history
    if (viewedProducts.length === 0) {
      return res.status(200).json({
        message: "No viewing history available",
        payload: [],
      });
    }

    // Count user's interests by category
    const categoryCounts = {};

    viewedProducts.forEach((product) => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });

    // Get available products
    const candidates = await ProductModel.find({
      isActive: true,
      status: "AVAILABLE",
      owner: { $ne: userId },
    }).lean();

    // Remove products the user has already viewed
    const viewedProductIds = new Set(viewedProducts.map((product) => product._id.toString()));

    const recommendations = candidates
      .filter((product) => !viewedProductIds.has(product._id.toString()))
      .map((product) => {
        const categoryCount = categoryCounts[product.category] || 0;

        const categoryScore = viewedProducts.length > 0 ? (categoryCount / viewedProducts.length) * 70 : 0;

        const recentViewScore = categoryCount > 0 ? 30 : 0;

        const finalScore = Number((categoryScore + recentViewScore).toFixed(2));

        return {
          ...product,
          recommendationScore: finalScore,
        };
      });

    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore);

    const topRecommendations = recommendations.slice(0, MAX_RECOMMENDATIONS);

    return res.status(200).json({
      message: "Personalized recommendations generated",
      basedOnViews: viewedProducts.length,
      payload: topRecommendations,
    });
  } catch (err) {
    next(err);
  }
};
