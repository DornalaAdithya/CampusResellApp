import exp from "express";
import { getRecommendations } from "../controllers/recommendation.controller.js";

const router = exp.Router();

router.get("/:pid", getRecommendations);

export default router;
