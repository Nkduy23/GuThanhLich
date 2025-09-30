import { useEffect, useState } from "react";
import type { Category, ProductPopulated } from "../../types";
import useAuth from "../../hooks/useAuth";
import CategoryCard from "../../components/home/CategoryCard";
import CategorySection from "../../components/home/CategorySection";

const Home: React.FC = () => {
  useAuth();
  const [products, setProducts] = useState<ProductPopulated[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // chỉ cha
  const [allCategories, setAllCategories] = useState<Category[]>([]); // tất cả

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/api/products").then((res) => res.json()),
          fetch("http://localhost:3000/api/categories").then((res) => res.json()),
        ]);

        // Set products
        setProducts(productsRes.products);

        // Set categories
        setAllCategories(categoriesRes.categories);
        const mainCategories = categoriesRes.categories.filter((cat: Category) => !cat.parentId);
        setCategories(mainCategories);
      } catch (err) {
        console.error("Error fetching products or categories:", err);
      }
    };

    fetchData();
  }, []);

  // lọc isFeatured từ toàn bộ categories (cả cha + con)
  const featuredCategories = allCategories.filter((cat) => cat.isFeatured).sort((a, b) => a.order - b.order);

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
          <button
            type="button"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => (window.location.href = "/categories")}
          >
            Xem thêm
          </button>
        </div>
      </div>

      {/* Phần Sản Phẩm */}
      {featuredCategories.map((cat) => (
        <CategorySection
          key={cat._id.toString()}
          title={cat.title}
          description={cat.description}
          products={getProductsByCategorySlug(cat.slug)}
          categorySlug={cat.slug}
          align="left"
        />
      ))}
    </>
  );
};

export default Home;
