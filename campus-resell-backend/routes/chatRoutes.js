import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createOrGetConversation,
  getUserConversations,
  getMessages,
  sendMessage,
} from "../controllers/chatController.js";

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(authenticate("USER"));

// POST /api/chat/conversation
router.post("/conversation", createOrGetConversation);

// GET /api/chat/conversations
router.get("/conversations", getUserConversations);

// GET /api/chat/:conversationId/messages
router.get("/:conversationId/messages", getMessages);

// POST /api/chat/message
router.post("/message", sendMessage);

export default router;
