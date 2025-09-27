import { Request, Response } from "express";
import Product from "../../models/Product";
import Product_spec from "../../models/ProductSpec";
import Review from "../../models/Review";
import ProductVariant from "../../models/ProductVariant";
import ProductVariantImage from "../../models/ProductVariantImage";
import ProductHighlight from "../../models/ProductHighlight";

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
    const product = await Product.findOne({ slug: req.params.slug }).populate("categoryId").lean();

    if (!product) {
      res.status(404).send("Không tìm thấy sản phẩm");
      return;
    }

    const specs = await Product_spec.find({ productId: product._id }).lean();

    const reviews = await Review.find({ productId: product._id }).lean();

    res.json({ success: true, product, specs, reviews });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

// Lấy danh sách variant theo slug product
export const getProductVariants = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const variants = await ProductVariant.find({ productId: product._id });
    res.json(variants);
  } catch (err) {
    res.status(500).json({ message: "Error fetching variants", error: err });
  }
};

// Lấy danh sách ảnh variant theo slug product
export const getProductVariantImages = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Lấy tất cả variant của product
    const variants = await ProductVariant.find({ productId: product._id });
    const variantIds = variants.map((v) => v._id);

    // Lấy tất cả ảnh có variantId thuộc các variant
    const variantImages = await ProductVariantImage.find({
      variantId: { $in: variantIds },
    });

    res.json(variantImages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching variant images", error: err });
  }
};

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
      .limit(4)
      .lean();

    res.json({ success: true, related });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm liên quan", error: err.message });
  }
};

export const getHighlight = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // Tìm product theo slug
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Lấy highlights theo productId
    const highlights = await ProductHighlight.find({ productId: product._id }).lean();

    res.json({
      success: true,
      productId: product._id,
      highlights,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error fetching highlights",
      error: error.message,
    });
  }
};
