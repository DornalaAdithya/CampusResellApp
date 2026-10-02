import { Schema, model } from "mongoose";

const productReportSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
      index: true,
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    reason: {
      type: String,
      enum: ["FAKE_PRODUCT", "WRONG_DESCRIPTION", "DAMAGED_PRODUCT", "PROHIBITED_ITEM", "SPAM", "DUPLICATE_LISTING", "OTHER"],
      required: [true, "Report reason required"],
    },

    message: {
      type: String,
      required: [true, "Report message required"],
      trim: true,
      minlength: [5, "Report message must contain at least 5 characters"],
      maxlength: [500, "Report message cannot exceed 500 characters"],
    },

    status: {
      type: String,
      enum: ["PENDING", "REVIEWED", "DISMISSED"],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);

// Prevent the same user from reporting the same product multiple times
productReportSchema.index({ product: 1, reporter: 1 }, { unique: true });

export const ProductReportModel = model("productReport", productReportSchema);
