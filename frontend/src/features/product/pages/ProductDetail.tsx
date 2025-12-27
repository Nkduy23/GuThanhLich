import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { apiRequest } from "@/api/fetcher";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "react-toastify";
import { useCart } from "@/context/cart/useCart";
import type {
  Product,
  ProductDetail,
  ProductVariant,
  ProductHighlights,
  Reviews,
  ProductSpecifications,
  Cart_Item,
} from "@/features/types";
import ProductCarousel from "@/features/product/components/ProductCarousel";
import { Breadcrumb, generateBreadcrumb } from "@/utils/breadcrumb";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [highlight, setHighlight] = useState<ProductHighlights[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [specs, setSpecs] = useState<ProductSpecifications[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isSpecsExpanded, setIsSpecsExpanded] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

  // Refs cho debounce và prevent multiple clicks
  const addToCartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastToastIdRef = useRef<string | number | null>(null);
  const isAddingRef = useRef(false); // Flag để prevent spam clicks

  const formatCurrency = (price: number) => `${price.toLocaleString("vi-VN")} VNĐ`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await apiRequest<{
          data: { product: ProductDetail; related: Product[] };
        }>(`${ENDPOINTS.product}/${slug}`);

        const data = productRes.data.product;

        setProduct(data);
        setVariants(data.productVariants || []);
        setSpecs(data.productSpecifications || []);
        setHighlight(data.productHighlights || []);
        setReviews(data.reviews || []);
        setRelatedProducts(productRes.data.related || []);
      } catch (error) {
        console.error("Error fetching product detail:", error);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  const breadcrumbItems = useMemo(() => {
    if (!product) return [];

    const categories = product.categoryId
      ? [
          {
            name: capitalize(product.categoryId.name),
            href: `/category/${product.categorySlug}`,
          },
        ]
      : [];

    return generateBreadcrumb(categories, product.name);
  }, [product]);

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

  useEffect(() => {
    if (!initialized && selectedVariant?.sizes && selectedVariant.sizes.length > 0) {
      setSelectedSize(selectedVariant.sizes[0].size);
      setInitialized(true);
    }
  }, [selectedVariant, initialized]);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (addToCartTimerRef.current) {
        clearTimeout(addToCartTimerRef.current);
      }
      if (lastToastIdRef.current) {
        toast.dismiss(lastToastIdRef.current);
      }
    };
  }, []);

  // Calculate discountedPrice trước (cần cho useCallback)
  const discountedPrice = useMemo(() => {
    if (!product) return null;
    return product.sale && product.sale > 0
      ? product.price - (product.price * product.sale) / 100
      : null;
  }, [product]);

  // Optimized handleAddToCart với debounce và prevent multiple clicks
  const handleAddToCart = useCallback(async () => {
    // Check product exists
    if (!product) {
      console.warn("⚠️ No product");
      return;
    }
    // Prevent spam clicks - nếu đang xử lý thì ignore
    if (isAddingRef.current) {
      console.log("⏳ Already processing, ignoring click");
      return;
    }

    // Validation checks
    if (!selectedSize) {
      console.warn("⚠️ No selectedSize");
      const toastId = toast.warn("Vui lòng chọn kích thước");
      lastToastIdRef.current = toastId;
      return;
    }

    if (quantity < 1) {
      console.warn("⚠️ Invalid quantity:", quantity);
      const toastId = toast.warn("Số lượng không hợp lý");
      lastToastIdRef.current = toastId;
      return;
    }

    if (!selectedVariant) {
      console.warn("⚠️ No selectedVariant");
      const toastId = toast.warn("Sản phẩm đang bị lỗi. Vui lòng báo admin để được hỗ trợ");
      lastToastIdRef.current = toastId;
      return;
    }

    // Dismiss previous toast if exists
    if (lastToastIdRef.current) {
      toast.dismiss(lastToastIdRef.current);
    }

    // Clear previous timer if exists (debounce)
    if (addToCartTimerRef.current) {
      clearTimeout(addToCartTimerRef.current);
    }

    // Set loading immediately for UI feedback
    setLoading(true);
    isAddingRef.current = true;

    // Debounce: delay actual API call
    addToCartTimerRef.current = setTimeout(async () => {
      const newItem: Cart_Item = {
        _id: selectedVariant._id,
        productId: selectedVariant?.productId ?? "",
        variantId: selectedVariant._id,
        name: product.name,
        price: discountedPrice ?? product?.price,
        image: mainImage,
        color: selectedVariant.color,
        size: selectedSize,
        quantity,
        availableColors: [],
        availableSizes: variants
          .filter((v) => v.color === selectedVariant.color)
          .flatMap((v) => v.sizes.map((s) => s.size)),
        unit_price: discountedPrice ?? product?.price,
        total_price: (discountedPrice ?? product?.price) * quantity,
      };

      try {
        await addToCart(newItem);
        const toastId = toast.success("Đã thêm sản phẩm vào giỏ hàng");
        lastToastIdRef.current = toastId;
        setQuantity(1);
      } catch (error) {
        console.error("[handleAddToCart] Error adding to cart:", error);
        const toastId = toast.error("Không thể thêm sản phẩm vào giỏ hàng");
        lastToastIdRef.current = toastId;
      } finally {
        setLoading(false);
        isAddingRef.current = false;

        // Auto-clear toast ID after 3s
        setTimeout(() => {
          lastToastIdRef.current = null;
        }, 3000);
      }
    }, 300); // 300ms debounce - ngắn hơn updateQuantity vì đây là action ít spam hơn
  }, [
    selectedSize,
    quantity,
    selectedVariant,
    product,
    discountedPrice,
    mainImage,
    variants,
    addToCart,
  ]);

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

  // Early return SAU tất cả hooks
  if (!product)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {breadcrumbItems.length > 0 && <Breadcrumb items={breadcrumbItems} />}
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
