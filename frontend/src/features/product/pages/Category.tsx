import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/CardProduct";
import type { Product } from "@/features/types";

interface CategoryResponse {
  success: boolean;
  category: {
    _id: string;
    name: string;
    title?: string;
    description?: string;
    slug: string;
    products: Product[];
  } | null;
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryResponse["category"] | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters / sort
  const [filterType, setFilterType] = useState<"all" | "new" | "sale">("all");
  const [sortBy, setSortBy] = useState<"none" | "price-asc" | "price-desc">("none");
  const [minPriceStr, setMinPriceStr] = useState<string>("");
  const [maxPriceStr, setMaxPriceStr] = useState<string>("");
  const [minPriceNum, setMinPriceNum] = useState<number | null>(null);
  const [maxPriceNum, setMaxPriceNum] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/category/${slug}`);
        const data: CategoryResponse = await response.json();
        if (data.success && data.category) {
          setCategory(data.category);
        } else {
          setCategory(null);
        }
      } catch (error) {
        console.error("Lỗi khi fetch category:", error);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  // Compute products with effectivePrice and memoize
  const processedProducts = useMemo(() => {
    if (!category?.products) return [];

    return category.products.map((p) => {
      const salePercent = p.sale ?? 0;
      const effectivePrice =
        salePercent && salePercent > 0 ? p.price - (p.price * salePercent) / 100 : p.price;

      return {
        ...p,
        effectivePrice,
      };
    });
  }, [category]);

  const visibleProducts = useMemo(() => {
    let list = processedProducts.slice();

    // Filter type
    if (filterType === "new") list = list.filter((p) => Boolean(p.is_new));
    if (filterType === "sale") list = list.filter((p) => (p.sale ?? 0) > 0);

    if (minPriceNum !== null && !Number.isNaN(minPriceNum)) {
      list = list.filter((p) => p.effectivePrice >= minPriceNum);
    }
    if (maxPriceNum !== null && !Number.isNaN(maxPriceNum)) {
      list = list.filter((p) => p.effectivePrice <= maxPriceNum);
    }

    // Sort by effectivePrice
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.effectivePrice - b.effectivePrice);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.effectivePrice - a.effectivePrice);
    }

    return list;
  }, [processedProducts, filterType, minPriceNum, maxPriceNum, sortBy]);

  const formatNumber = (value: string) => {
    // Bỏ ký tự không phải số
    const numericValue = value.replace(/\D/g, "");
    // Format có dấu phẩy
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const parseNumber = (formatted: string) => {
    return Number(formatted.replace(/,/g, "")) || 0;
  };
  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!category) return <p className="text-center mt-10">Không tìm thấy danh mục này.</p>;

  return (
    <main className="mx-auto max-w-7xl px-4 p-6 container">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold uppercase mb-2">{category.title || category.name}</h1>
        {category.description && (
          <p className="text-gray-600 text-base max-w-2xl mx-auto">{category.description}</p>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Lọc:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as never)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="new">Hàng mới</option>
            <option value="sale">Đang giảm giá</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Giá:</label>
          <input
            type="text"
            placeholder="Min"
            value={minPriceStr}
            onChange={(e) => {
              const formatted = formatNumber(e.target.value);
              setMinPriceStr(formatted);
              setMinPriceNum(parseNumber(formatted));
            }}
            className="w-28 border border-gray-300 rounded-md px-2 py-1 text-sm"
          />
          <span className="text-gray-400">—</span>
          <input
            type="text"
            placeholder="Max"
            value={maxPriceStr}
            onChange={(e) => {
              const formatted = formatNumber(e.target.value);
              setMaxPriceStr(formatted);
              setMaxPriceNum(parseNumber(formatted));
            }}
            className="w-28 border border-gray-300 rounded-md px-2 py-1 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Sắp xếp:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as never)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="none">Mặc định</option>
            <option value="price-asc">Giá: Thấp → Cao</option>
            <option value="price-desc">Giá: Cao → Thấp</option>
          </select>
        </div>
      </div>

      {/* Product list */}
      {visibleProducts.length === 0 ? (
        <p className="text-center text-gray-500">Không có sản phẩm phù hợp với bộ lọc.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoryPage;
