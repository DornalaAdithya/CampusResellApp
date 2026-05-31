import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Product title required"],
      trim: true,
      minlength: [3, "Title must contain at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price required"],
      min: 0,
    },

    category: {
      type: String,
      enum: ["BOOKS", "ELECTRONICS", "CYCLES", "FURNITURE", "FASHION", "OTHERS"],
      required: [true, "Category required"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description required"],
      minlength: [10, "Description must contain at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      trim: true,
    },

    productImages: {
      type: [String],
      default: [],

      validate: {
        validator: function (arr) {
          return arr.length <= 5;
        },
        message: "Maximum 5 images allowed",
      },
    },

    condition: {
      type: String,
      enum: ["NEW", "LIKE_NEW", "GOOD", "FAIR"],
      default: "GOOD",
      index: true,
    },

    isNegotiable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "SOLD"],
      default: "AVAILABLE",
      index: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);

// Compound index
productSchema.index({
  category: 1,
  status: 1,
  createdAt: -1,
});

export const ProductModel = model("product", productSchema);
