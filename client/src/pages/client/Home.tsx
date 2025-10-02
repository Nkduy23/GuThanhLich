import { useEffect, useState } from "react";
import type { Category, ProductPopulated } from "../../types";
import useAuth from "../../hooks/useAuth";
import CategoryCard from "../../components/home/CategoryCard";
import CategorySection from "../../components/home/CategorySection";
import BlogSection from "../../components/home/BlogSection";
import FeedbackForm from "../../components/home/FeedbackForm";

const Home: React.FC = () => {
  useAuth();
  const [products, setProducts] = useState<ProductPopulated[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // chỉ cha
  const [allCategories, setAllCategories] = useState<Category[]>([]); // tất cả

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/api/").then((res) => res.json()),
          fetch("http://localhost:3000/api/categories").then((res) => res.json()),
        ]);

        // console.log("homeRes", homeRes);

        // homeRes = { success: true, categories: [...] }
        const categoriesFromHome = homeRes.categories || [];

        // flatten products từ categories để có 1 mảng products dùng chung
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flatProducts = categoriesFromHome.flatMap((cat: any) => cat.products || []);

        setProducts(flatProducts);

        // Set categories (all + main)
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
    if (slug === "khuyen-mai") {
      return products.filter((product) => product.sale && product.sale > 0).slice(0, 10);
    }

    return products.filter((product) => product.categorySlug === slug || product.tags?.includes(slug)).slice(0, 10);
  };

  return (
    <>
      {/* Phần Loại */}
      <div className="category mb-12 mx-auto max-w-6xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Danh Mục Sản Phẩm</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <CategoryCard key={typeof category._id === "object" ? category._id["$oid"] : category._id} category={category} />
          ))}
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

      <BlogSection />
      <FeedbackForm />
    </>
  );
};

export default Home;
