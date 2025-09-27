import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProductPopulated, Variant, VariantImage, Highlight, Review, Spec } from "../../types";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductPopulated | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [variantImages, setVariantImages] = useState<VariantImage[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [highlight, setHighlight] = useState<Highlight[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductPopulated[]>([]);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);

  const formatCurrency = (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`;

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setReviews(data.reviews || []);
        setSpecs(data.specs || []);

        // Gọi đúng API related mới
        fetch(`http://localhost:3000/api/products/${slug}/related`)
          .then((res) => res.json())
          .then((related) => {
            setRelatedProducts(related.related || []);
          });
      });

    fetch(`http://localhost:3000/api/products/${slug}/variant`)
      .then((res) => res.json())
      .then((data) => setVariants(data));

    fetch(`http://localhost:3000/api/products/${slug}/variant_image`)
      .then((res) => res.json())
      .then((data) => setVariantImages(data));

    fetch(`http://localhost:3000/api/products/${slug}/highlight`)
      .then((res) => res.json())
      .then((data) => setHighlight(data.highlights));
  }, [slug]);

  useEffect(() => {
    if (product && variants.length > 0) {
      const v = variants.find((v) => v.productId === product._id);
      if (v) {
        setSelectedVariant(v);
        const imgs = variantImages.find((vi) => vi.variantId === v._id);
        if (imgs) setMainImage(imgs.images[0]);
      }
    }
  }, [product, variants, variantImages]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  const handleChangeVariant = (variantId: string) => {
    const v = variants.find((v) => v._id === variantId) || null;
    setSelectedVariant(v);
    if (v) {
      const imgs = variantImages.find((vi) => vi.variantId === v._id);
      if (imgs) setMainImage(imgs.images[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Phần trên: ảnh và thông tin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Bên trái: main image + thumbnails */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">{mainImage && <img src={mainImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />}</div>

          {/* thumbnails */}
          {selectedVariant && variantImages.find((vi) => vi.variantId === selectedVariant._id)?.images && (
            <div className="flex gap-2 flex-wrap">
              {variantImages
                .find((vi) => vi.variantId === selectedVariant._id)
                ?.images.map((img) => (
                  <button key={img} onClick={() => setMainImage(img)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-blue-400 ${mainImage === img ? "border-blue-500 shadow-md" : "border-gray-200"}`}>
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Bên phải: thông tin sản phẩm */}
        <div className="lg:sticky lg:top-8 h-fit space-y-6">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Danh mục: <span className="font-medium">{product.categoryId.name}</span>
            </p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
            <p className="mt-4 text-3xl font-bold text-red-600">{formatCurrency(product.price)}</p>
          </div>

          {/* chọn màu */}
          <div className="mt-4">
            <p className="font-medium mb-2">Màu:</p>
            <div className="flex gap-2 flex-wrap">
              {variants
                .filter((v) => v.productId === product._id)
                .map((v) => {
                  const thumb = variantImages.find((vi) => vi.variantId === v._id)?.images[0];
                  return (
                    <button key={v._id} className={`flex flex-col items-center border rounded-full overflow-hidden p-1 ${selectedVariant?._id === v._id ? "border-blue-500" : "border-gray-300"}`} onClick={() => handleChangeVariant(v._id)}>
                      {thumb && <img src={thumb} alt={v.color} className="w-15 h-15 object-cover rounded" />}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* chọn size */}
          {selectedVariant?.sizes && selectedVariant.sizes.length > 0 && (
            <div>
              <p className="font-semibold text-gray-900 mb-3">Kích thước:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedVariant.sizes.map((s) => (
                  <button key={s.size} className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium" disabled={s.quantity === 0}>
                    <span className={s.quantity === 0 ? "text-gray-400" : "text-gray-900"}>{s.size}</span>
                    <span className="text-xs text-gray-500 ml-1">({s.quantity})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* chọn số lượng */}
          <div>
            <label htmlFor="quantity" className="block font-semibold text-gray-900 mb-3">
              Số lượng:
            </label>
            <input type="number" id="quantity" name="quantity" min="1" max="5" defaultValue="1" className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200" />
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">Thêm Vào Giỏ Hàng</button>

          {/* Thông số kỹ thuật - Collapsible */}
          {specs.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <button onClick={() => setIsSpecsExpanded(!isSpecsExpanded)} className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200">
                <span>Thông số kỹ thuật</span>
                <svg className={`w-5 h-5 transform transition-transform duration-200 ${isSpecsExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isSpecsExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 mt-3">
                    {specs.map((spec) => (
                      <div key={spec._id} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-medium text-gray-700">{spec.key}:</span>
                        <span className="text-gray-900 text-right flex-1 ml-4">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Đặc điểm nổi bật */}
          {highlight.length > 0 && selectedVariant && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Đặc điểm nổi bật</h2>
              <div className="space-y-4">
                {highlight.map((h, index) => {
                  const images = variantImages.find((vi) => vi.variantId === selectedVariant._id)?.images || [];
                  const img = images[index] || images[0];

                  return (
                    <div key={h._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      {img && <img src={img} alt={h.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{h.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{h.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review */}
      {reviews.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá khách hàng</h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{review.user}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rate ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-sm text-gray-500 ml-1">({review.rate}/5)</span>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <Link key={rp._id} to={`/product/${rp.slug}`} className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="aspect-square overflow-hidden">
                  <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors duration-200">{rp.name}</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(rp.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
