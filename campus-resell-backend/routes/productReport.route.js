import exp from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { reportProduct, getProductReportSummary } from "../controllers/productReport.controller.js";

const router = exp.Router();

router.post("/:pid", authenticate("USER"), reportProduct);
router.get("/:pid", getProductReportSummary);

export default router;
