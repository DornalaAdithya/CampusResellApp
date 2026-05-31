import exp from "express";
import { getProfile, login, logout, register, updateProfilePhoto, changePassword } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = exp.Router();

router.post("/register", upload.single("profileUrl"), register);
router.post("/login", login);
router.get("/profile", authenticate("USER", "ADMIN"), getProfile);
router.post("/logout", logout);
router.put("/profile-photo", authenticate("USER", "ADMIN"), upload.single("profileImage"), updateProfilePhoto);
router.put("/change-password", authenticate("USER", "ADMIN"), changePassword);

export default router;
