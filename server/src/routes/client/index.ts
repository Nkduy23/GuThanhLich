import { Router } from "express";
import productRouter from "./product.routes";
import homeRouter from "./home.routes";
import categoryRouter from "./category.routes";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import commentRouter from "./comment.routes";
import reviewRouter from "./review.routes";
import brandRouter from "./brand.routers";
import { Review } from "../../models";

const router = Router();

router.use("/", homeRouter);
router.use("/products", productRouter);
router.use("/comments", commentRouter);
router.use("/reviews", reviewRouter);
router.use("/brand", brandRouter);
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/categories", categoryRouter);

export default router;
