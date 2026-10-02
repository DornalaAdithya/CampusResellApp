import { Schema, model } from "mongoose";

const userViewHistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
      index: true,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userViewHistorySchema.index({
  user: 1,
  viewedAt: -1,
});

userViewHistorySchema.index({ user: 1, product: 1 }, { unique: true });

export const UserViewHistoryModel = model("userViewHistory", userViewHistorySchema);
