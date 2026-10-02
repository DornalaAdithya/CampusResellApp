import { ProductModel } from "../models/ProductModel.js";
import { ProductReportModel } from "../models/ProductReportModel.js";

export const reportProduct = async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const userId = req.user.userId;

    const { reason, message } = req.body;

    // Check whether product exists
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    // Owner cannot report their own product
    if (product.owner.toString() === userId) {
      return res.status(403).json({
        message: "You cannot report your own product",
      });
    }

    // Check for duplicate report
    const existingReport = await ProductReportModel.findOne({
      product: productId,
      reporter: userId,
    });

    if (existingReport) {
      return res.status(409).json({
        message: "You have already reported this product",
      });
    }

    const report = new ProductReportModel({
      product: productId,
      reporter: userId,
      reason,
      message,
    });

    await report.save();

    res.status(201).json({
      message: "Product reported successfully",
      payload: report,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductReportSummary = async (req, res, next) => {
  try {
    const productId = req.params.pid;

    const reports = await ProductReportModel.find({
      product: productId,
    }).select("reason message createdAt");

    const reasonCounts = {};

    reports.forEach((report) => {
      reasonCounts[report.reason] = (reasonCounts[report.reason] || 0) + 1;
    });

    res.status(200).json({
      totalReports: reports.length,
      reasonCounts,
      reports: reports.map((report) => ({
        reason: report.reason,
        message: report.message,
        createdAt: report.createdAt,
      })),
    });
  } catch (err) {
    next(err);
  }
};
