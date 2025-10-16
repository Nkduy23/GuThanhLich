import { Product, ProductSpec, ProductHighlight, ProductVariant } from "../../models";

export const getProducts = async () => {
  const products = await Product.find()
    .select("_id name slug price sale image is_active brandSlug categoryId")
    .populate("categoryId", "name")
    .populate("productVariants", "sizes images") // có mảng sizes bên trong
    .lean();

  const processed = products.map((p) => {
    // Tổng stock từ tất cả variant -> size -> quantity
    const totalStock =
      p.productVariants?.reduce((sum, variant: any) => {
        const variantStock = variant.sizes?.reduce(
          (subSum: number, size: any) => subSum + (size.quantity || 0),
          0
        );
        return sum + (variantStock || 0);
      }, 0) || 0;

    const variants = (p.productVariants as any[]) || [];
    const firstVariantImage = variants[0]?.images?.[0] || null;

    const finalPrice = p.sale && p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;

    return {
      ...p,
      finalPrice,
      totalStock,
      image: firstVariantImage,
    };
  });

  return processed;
};

// 🟢 Lấy chi tiết 1 sản phẩm
export const getProductById = async (id: string) => {
  return Product.findById(id)
    .populate("categoryId", "name")
    .populate("brandId", "name")
    .populate("productVariants")
    .populate("productSpecs")
    .populate("productHighlights")
    .lean();
};

// 🟢 Tạo sản phẩm mới
export const createProduct = async (data: any) => {
  const product = new Product(data);
  return product.save();
};

// 🟢 Cập nhật sản phẩm + các bảng liên quan
export const updateProduct = async (id: string, data: any) => {
  try {
    // 1️⃣ Update bảng chính
    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    if (!product) throw new Error("Product not found");

    // 2️⃣ Update bảng con
    if (data.productSpecs) {
      await ProductSpec.deleteMany({ productId: id });
      await ProductSpec.insertMany(data.productSpecs.map((s: any) => ({ ...s, productId: id })));
    }

    if (data.productHighlights) {
      await ProductHighlight.deleteMany({ productId: id });
      await ProductHighlight.insertMany(
        data.productHighlights.map((h: any) => ({ ...h, productId: id }))
      );
    }

    if (data.productVariants) {
      await ProductVariant.deleteMany({ productId: id });
      await ProductVariant.insertMany(
        data.productVariants.map((v: any) => ({ ...v, productId: id }))
      );
    }

    return product;
  } catch (err) {
    throw err;
  }
};

// 🟢 Xóa sản phẩm
export const deleteProduct = async (id: string) => {
  return Product.findByIdAndDelete(id);
};
