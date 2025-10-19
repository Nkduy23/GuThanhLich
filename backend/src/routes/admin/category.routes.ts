import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../controllers/admin/category.controller";

// Config Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../../uploads/categories");
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

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategoryById);

// POST/PUT với single file upload
router.post("/", upload.single("image"), createCategory);
router.put("/:id", upload.single("image"), updateCategory);

router.delete("/:id", deleteCategory);

export default router;
