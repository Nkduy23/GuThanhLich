import { Router } from "express";
import dashboardRouter from "./dashboard.routes";
import userRouter from "./auth.routes";
import categoryRouter from "./category.routes";
import productRouter from "./product.routes";
import brandRouter from "./brand.routes";

const router = Router();

router.use("/", dashboardRouter);
router.use("/user", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/brands", brandRouter);

// router.post("/upload", [upload.single("image")], async (req, res, next) => {
//   try {
//     const { file } = req;
//     if (!file) {
//       return res.json({ status: 0, link: "" });
//     } else {
//       const url = `/images/${file.filename}`; //url muốn lưu trong csdl
//       return res.json({ status: 1, url: url });
//     }
//   } catch (error) {
//     console.log("Upload image error: ", error);
//     return res.json({ status: 0, link: "" });
//   }
// });

export default router;
