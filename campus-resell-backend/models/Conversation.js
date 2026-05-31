import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageAt: {
      type: Date,
    },
  },
  { timestamps: true, strict: "throw", versionKey: false }
);

export const ConversationModel = model("conversation", conversationSchema);
