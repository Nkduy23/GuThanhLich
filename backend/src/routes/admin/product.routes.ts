// admin/product.routes.ts
import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controllers/admin/product.controller";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../uploads/products");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!") as any, false);
    }
  },
});

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload.array("variantImages", 20), createProduct); // Allow up to 20 images per request
router.put("/:id", upload.array("variantImages", 20), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
