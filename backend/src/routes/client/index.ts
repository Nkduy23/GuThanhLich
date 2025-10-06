import { Router } from "express";
import productRouter from "./product.routes";
import homeRouter from "./home.routes";
import categoryRouter from "./category.routes";
import checkoutRouter from "./checkout.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import reviewRouter from "./review.routes";
import brandRouter from "./brand.routers";
import blogRouter from "./blog.routes";

const router = Router();

router.use("/", homeRouter);
router.use("/products", productRouter);
router.use("/checkout", checkoutRouter);
router.use("/reviews", reviewRouter);
router.use("/brand", brandRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/categories", categoryRouter);
router.use("/blogs", blogRouter);

export default router;
