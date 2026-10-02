import exp from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getPersonalizedRecommendations } from "../controllers/personalizedRecommendation.controller.js";

const router = exp.Router();

router.get("/", authenticate("USER"), getPersonalizedRecommendations);

export default router;
