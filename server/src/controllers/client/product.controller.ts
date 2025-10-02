import { Request, Response } from "express";
import Product from "../../models/Product";

export const getProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find().populate("categoryId", "slug name");
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
  }
};

export const getProductDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("categoryId", "slug name")
      .populate("productSpecs")
      .populate("reviews")
      .populate("productVariants")
      .populate("productHighlights")
      .lean();

    if (!product) {
      res.status(404).send("Không tìm thấy sản phẩm");
      return;
    }

    res.json({ success: true, product });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Lấy sản phẩm liên quan theo slug
// Lấy sản phẩm liên quan theo slug
export const getRelated = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Tìm sản phẩm hiện tại
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    // Lấy danh sách sản phẩm liên quan cùng categorySlug (trừ chính nó)
    const related = await Product.find({
      categorySlug: product.categorySlug,
      slug: { $ne: product.slug },
    })
      .populate("defaultVariantId") // populate luôn để có ảnh + màu
      .limit(4)
      .lean();

    res.json({ success: true, related });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm liên quan", error: err.message });
  }
};
