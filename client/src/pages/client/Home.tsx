import { useEffect, useState } from "react";
import type { Category, Product } from "../../types";
import useAuth from "../../hooks/useAuth";
import CategoryCard from "../../components/home/CategoryCard";
import CategorySection from "../../components/home/CategorySection";

const Home: React.FC = () => {
  useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Fetch products
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.products))
      .catch((err) => console.error(err));

    // Fetch categories
    fetch("http://localhost:3000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        const mainCategories = data.categories.filter((cat: Category) => !cat.parentId);
        setCategories(mainCategories);
      })
      .catch((err) => console.error(err));
  }, []);

  // Hàm lọc sản phẩm theo categoryId
  const getProductsByCategorySlug = (slug: string) => {
    return products.filter((product) => typeof product.categoryId === "object" && product.categoryId.slug === slug).slice(0, 10);
  };

  return (
    <>
      {/* Phần Loại */}
      <div className="category mb-12 mx-auto max-w-7xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Loại</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard key={typeof category._id === "object" ? category._id["$oid"] : category._id} category={category} />
          ))}
        </div>
        <div className="text-center mt-8">
          <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => (window.location.href = "/categories")}>
            Xem thêm
          </button>
        </div>
      </div>

      {/* Phần Sản Phẩm */}
      <CategorySection title="Sản Phẩm Khuyến Mãi" products={getProductsByCategorySlug("khuyen-mai")} categorySlug="khuyen-mai" />
      <CategorySection title="Trạm 1 | Thời Trang Thiết Yếu" description="Nền Tảng Phong Cách, Chất Lượng Vượt Thời Gian" products={getProductsByCategorySlug("gu")} categorySlug="tram-1" align="left" />
      <CategorySection title="Áo" products={getProductsByCategorySlug("ao")} categorySlug="ao" />
    </>
  );
};

export default Home;
