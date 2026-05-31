import exp from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getUsers } from "../controllers/user.controller.js";

const router = exp.Router();

//get all users
router.get("/", authenticate("ADMIN"), getUsers);

export default router;
