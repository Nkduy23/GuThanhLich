import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ProductPopulated, Variant, Highlight, Review, Spec, Cart_Item } from "../../types";
import ProductCarousel from "../components/product/ProductCarousel";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductPopulated | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [highlight, setHighlight] = useState<Highlight[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductPopulated[]>([]);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatCurrency = (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes] = await Promise.all([
          fetch(`http://localhost:3000/api/products/${slug}`).then((res) => res.json()),
        ]);
        setProduct(productRes.product);
        setVariants(productRes.product.productVariants || []);
        setHighlight(productRes.product.productHighlights || []);
        setReviews(productRes.product.reviews || []);
        setSpecs(productRes.product.productSpecs || []);
        setRelatedProducts(productRes.related || []);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    if (product && variants.length > 0) {
      const v = variants.find((v) => v.productId === product._id);
      if (v) {
        setSelectedVariant(v);
        setDisplayName(product.name);
        if (v.images && v.images.length > 0) {
          setMainImage(v.images[0]);
        }
      }
    }
  }, [product, variants]);

  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  const discountedPrice =
    product.sale && product.sale > 0 ? product.price - (product.price * product.sale) / 100 : null;

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError("Vui lòng chọn kích thước");
      return;
    }

    if (quantity < 1) {
      setError("Số lượng phải lớn hơn 0");
      return;
    }

    if (!selectedVariant) {
      setError("Không tìm thấy biến thể sản phẩm");
      return;
    }

    setLoading(true);
    setError(null);

    const newItem: Cart_Item = {
      _id: "", // replace with a valid _id value
      productId: selectedVariant.productId,
      variantId: selectedVariant._id,
      name: product.name, // replace with a valid name value
      image: product.image ?? "", // replace with a valid image value
      color: selectedVariant.color, // replace with a valid color value
      size: selectedSize,
      quantity,
      unit_price: discountedPrice ?? product?.price,
      total_price: discountedPrice ?? product?.price * quantity,
      availableColors: [],
      availableSizes: [],
      price: 0,
    };

    try {
      if (isAuthenticated) {
        // Nếu đã đăng nhập -> thêm vào DB qua API
        await addToCart(newItem);
      } else {
        // Nếu chưa login -> lưu localStorage
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const existingIndex = localCart.findIndex(
          (item: Cart_Item) => item.variantId === newItem.variantId && item.size === newItem.size
        );

        if (existingIndex > -1) {
          localCart[existingIndex].quantity += quantity;
        } else {
          localCart.push(newItem);
        }

        localStorage.setItem("cart", JSON.stringify(localCart));
      }

      alert("Thêm vào giỏ hàng thành công");
      setQuantity(1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVariant = (variantId: string) => {
    const v = variants.find((v) => v._id === variantId) || null;
    setSelectedVariant(v);
    if (v && v.images && v.images.length > 0) {
      setMainImage(v.images[0]);
    }
    if (v?.variantName) {
      setDisplayName(v.variantName);
    } else {
      setDisplayName(product?.name || "");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Phần trên: ảnh và thông tin */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Bên trái: main image + thumbnails */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            )}
          </div>

          {/* thumbnails */}
          {selectedVariant?.images && selectedVariant.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
              {selectedVariant.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setMainImage(img)}
                  className={`min-w-[80px] h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-blue-400 ${
                    mainImage === img ? "border-blue-500 shadow-md" : "border-gray-200"
                  }`}
                >
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
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">{displayName}</h1>
            {discountedPrice ? (
              <div className="flex gap-4 mt-1">
                <p className="text-red-600 font-semibold text-2xl">
                  {formatCurrency(discountedPrice)}
                </p>
                <p className="text-gray-500 line-through text-sm">
                  {formatCurrency(product.price)}
                </p>
                <span className="absolute top-2 right-4 ml-2 text-white bg-red-600 px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                  -{product.sale}%
                </span>
              </div>
            ) : (
              <p className="text-gray-600 mt-1">Giá: {formatCurrency(product.price)}</p>
            )}
          </div>

          {/* chọn màu */}
          <div className="mt-4">
            <p className="font-medium mb-2">Màu:</p>
            <div className="flex gap-2 flex-wrap">
              {variants
                .filter((v) => v.productId === product._id)
                .map((v) => (
                  <button
                    key={v._id}
                    className={`flex gap-2 items-center border rounded-2xl overflow-hidden p-1 ${
                      selectedVariant?._id === v._id ? "border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => handleChangeVariant(v._id)}
                  >
                    {v.images && v.images[0] && (
                      <img
                        src={v.images[0]}
                        alt={v.color}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <span className="text-sm mt-1">{v.color}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* chọn size */}
          {selectedVariant?.sizes && selectedVariant.sizes.length > 0 && (
            <div>
              <p className="font-semibold text-gray-900 mb-3">Kích thước:</p>
              <div className="flex gap-3 flex-wrap">
                {selectedVariant.sizes.map((s) => (
                  <button
                    key={s.size}
                    onClick={() => setSelectedSize(s.size)}
                    className={`px-4 py-2 border-2 rounded-lg transition-all duration-200 font-medium 
            ${
              selectedSize === s.size
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-gray-200 text-gray-900"
            }
            ${
              s.quantity === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-blue-400 hover:bg-blue-50"
            }
          `}
                    disabled={s.quantity === 0}
                  >
                    <span className={s.quantity === 0 ? "text-gray-400" : ""}>{s.size}</span>
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
            <input
              type="number"
              id="quantity"
              name="quantity"
              min="1"
              max={
                selectedSize
                  ? selectedVariant?.sizes.find((s) => s.size === selectedSize)?.quantity || 5
                  : 5
              }
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={loading || !selectedSize}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? "Đang thêm..." : "Thêm Vào Giỏ Hàng"}
          </button>

          {/* Thông số kỹ thuật - Collapsible */}
          {specs.length > 0 && (
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => setIsSpecsExpanded(!isSpecsExpanded)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>Thông số kỹ thuật</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    isSpecsExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isSpecsExpanded && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <div className="space-y-3 mt-3">
                    {specs.map((spec) => (
                      <div
                        key={spec._id}
                        className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
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
                  const img = selectedVariant.images[index] || selectedVariant.images[0];
                  return (
                    <div
                      key={h._id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    >
                      {img && (
                        <img
                          src={img}
                          alt={h.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
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
              <div
                key={review._id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{review.user}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rate ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
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
          <ProductCarousel
            products={relatedProducts.slice(0, 10)}
            categorySlug={product.categorySlug}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
