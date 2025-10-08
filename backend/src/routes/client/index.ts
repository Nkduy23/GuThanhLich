import { Router } from "express";
import productRouter from "./product.routes";
import checkoutRouter from "./checkout.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import reviewRouter from "./review.routes";
import brandRouter from "./brand.routers";
import blogRouter from "./blog.routes";
import { renderHome } from "../../controllers/client/home.controller";
import {
  renderCategory,
  renderCategories,
  renderParentCategories,
} from "../../controllers/client/category.controller";

const router = Router();

router.get("/", renderHome);
router.use("/products", productRouter);
router.get("/category/:slug", renderCategory);
router.use("/categories", renderCategories);
router.use("/parentCategories", renderParentCategories);
router.use("/checkout", checkoutRouter);
router.use("/reviews", reviewRouter);
router.use("/brand", brandRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/blogs", blogRouter);

export default router;
