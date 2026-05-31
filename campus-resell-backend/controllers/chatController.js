import { ConversationModel } from "../models/Conversation.js";
import { MessageModel } from "../models/Message.js";
import { ProductModel } from "../models/ProductModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// POST /api/chat/conversation
export const createOrGetConversation = async (req, res) => {
  const { productId } = req.body;
  const buyerId = req.user.userId;

  if (!productId) {
    throw { status: 400, message: "Product ID is required" };
  }

  // Fetch product to get the seller
  const product = await ProductModel.findById(productId);
  if (!product) {
    throw { status: 404, message: "Product not found" };
  }

  const sellerId = product.owner.toString();

  // Prevent users from starting a conversation with themselves
  if (buyerId === sellerId) {
    throw { status: 400, message: "You cannot start a conversation with yourself" };
  }

  // Check whether a conversation already exists for same product, same buyer, same seller
  let conversation = await ConversationModel.findOne({
    product: productId,
    participants: { $all: [buyerId, sellerId] },
  }).populate("participants", "firstName lastName profileUrl");

  if (conversation) {
    return res.status(200).json({ success: true, conversation });
  }

  // Otherwise create a new conversation
  conversation = new ConversationModel({
    product: productId,
    participants: [buyerId, sellerId],
  });

  await conversation.save();

  // Populate participants for consistency with the existing conversation return
  await conversation.populate("participants", "firstName lastName profileUrl");

  res.status(201).json({ success: true, conversation });
};

// GET /api/chat/conversations
export const getUserConversations = async (req, res) => {
  const userId = req.user.userId;

  // Return only conversations where logged-in user is a participant
  const conversations = await ConversationModel.find({
    participants: userId,
  })
    // Populate product title, image, price, owner
    .populate("product", "title productImages price owner")
    // Populate participant basic details
    .populate("participants", "firstName lastName profileUrl")
    // Sort by lastMessageAt descending
    .sort({ lastMessageAt: -1 });

  res.status(200).json({ success: true, conversations });
};

// GET /api/chat/:conversationId/messages
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.userId;

  // Verify conversation exists
  const conversation = await ConversationModel.findById(conversationId)
    .populate("product", "title productImages price owner")
    .populate("participants", "firstName lastName profileUrl");
    
  if (!conversation) {
    throw { status: 404, message: "Conversation not found" };
  }

  // Verify logged-in user belongs to conversation
  const isParticipant = conversation.participants.some(
    (participant) => participant._id.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw { status: 403, message: "Not a participant of this conversation" };
  }

  // Return messages sorted by createdAt ascending
  const messages = await MessageModel.find({ conversation: conversationId }).sort({ createdAt: 1 });

  res.status(200).json({ success: true, messages, conversation });
};

// POST /api/chat/message
export const sendMessage = async (req, res) => {
  const { conversationId, text } = req.body;
  const userId = req.user.userId;

  if (!conversationId || !text) {
    throw { status: 400, message: "Conversation ID and text are required" };
  }

  // Verify conversation exists
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) {
    throw { status: 404, message: "Conversation not found" };
  }

  // Verify user belongs to conversation
  const isParticipant = conversation.participants.some(
    (id) => id.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw { status: 403, message: "Not a participant of this conversation" };
  }

  // Create new message
  const newMessage = new MessageModel({
    conversation: conversationId,
    sender: userId,
    text,
  });

  await newMessage.save();

  // Update conversation lastMessage and lastMessageAt
  conversation.lastMessage = text;
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // Socket.io functionality to emit message in real time
  const receiverId = conversation.participants.find((p) => p.toString() !== userId);
  if (receiverId) {
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() is used to send events to a specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  }

  res.status(201).json({ success: true, message: newMessage });
};
