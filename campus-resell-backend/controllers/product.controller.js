import { ProductModel } from "../models/ProductModel.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

export const getMyProducts = async (req, res) => {
  const userId = req.user.userId;

  const products = await ProductModel.find({
    owner: userId,
    isActive: true,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    message: "User products",
    payload: products,
  });
};

export const getAllProducts = async (req, res) => {
  const userId = req.user?.userId;

  const filter = {
    isActive: true,
    status: "AVAILABLE",
  };

  if (userId) {
    filter.owner = { $ne: userId }; // exclude own products
  }

  const products = await ProductModel.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    message: "Available products",
    payload: products,
  });
};

export const addProductToSell = async (req, res, next) => {
  let uploadedImages = [];

  try {
    // Upload images to cloudinary
    if (req.files?.length) {
      uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          const result = await uploadToCloudinary(file.buffer);

          return {
            secure_url: result.secure_url,
            public_id: result.public_id,
          };
        }),
      );
    }

    // Extract image urls
    const productImages = uploadedImages.map((img) => img.secure_url);

    // Create product object
    const product = {
      ...req.body,
      owner: req.user.userId,
      productImages,
    };

    // Save product
    const productDocument = new ProductModel(product);

    await productDocument.save();

    const newProduct = productDocument.toObject();

    res.status(201).json({
      message: "Product Created",
      payload: newProduct,
    });
  } catch (err) {
    // rollback cloudinary uploads
    if (uploadedImages.length) {
      await Promise.all(uploadedImages.map((img) => cloudinary.uploader.destroy(img.public_id)));
    }

    next(err);
  }
};

export const getProductByID = async (req, res) => {
  const productId = req.params.pid;
  const product = await ProductModel.findById(productId).populate("owner", "firstName lastName profileUrl email");
  if (!product) {
    return res.status(404).json({ message: "Product Not Found", payload: {} });
  }
  return res.status(200).json({ message: "product found", payload: product });
};

export const updateProductStatus = async (req, res) => {
  const productId = req.params.pid;
  const { status } = req.body;
  const userId = req.user.userId;

  if (!["AVAILABLE", "SOLD"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const product = await ProductModel.findById(productId);
  
  if (!product) {
    return res.status(404).json({ message: "Product Not Found" });
  }

  if (product.owner.toString() !== userId) {
    return res.status(403).json({ message: "Unauthorized to modify this product" });
  }

  product.status = status;
  await product.save();

  return res.status(200).json({ message: "Product status updated", payload: product });
};
