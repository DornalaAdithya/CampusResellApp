import exp from "express";
import { authenticate, optionalAuthenticate } from "../middlewares/auth.middleware.js";
import { addProductToSell, getAllProducts, getMyProducts, getProductByID, updateProductStatus } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = exp.Router();

//add product to sell
router.post("/", authenticate("USER"), upload.array("productImages", 5), addProductToSell);

//get all products of the current loggedin user
router.get("/me", authenticate("USER"), getMyProducts);

//get all products which are available to buy
router.get("/", optionalAuthenticate, getAllProducts);

//get product by ID
router.get("/:pid", optionalAuthenticate, getProductByID);

//update product status
router.put("/:pid/status", authenticate("USER"), updateProductStatus);

export default router;
