import { useEffect, useState } from "react";
import type { Category } from "../../types";
import useAuth from "../../hooks/useAuth";
import CategoryCard from "../../components/home/CategoryCard";
import CategorySection from "../../components/home/CategorySection";
import BlogSection from "../../components/home/BlogSection";
import FeedbackForm from "../../components/home/FeedbackForm";
import ImageCollage from "../../components/home/ImageCollage";
import React from "react";

const Home: React.FC = () => {
  useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, categoriesRes] = await Promise.all([
          fetch("http://localhost:3000/api/").then((res) => res.json()),
          fetch("http://localhost:3000/api/categories").then((res) => res.json()),
        ]);

        setCategories(homeRes.categories || []);

        // all categories (để dùng cho menu, filter,...)
        setAllCategories(categoriesRes.categories || []);
      } catch (err) {
        console.error("Error fetching products or categories:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Phần Loại */}
      <div className="category mb-12 mx-auto max-w-6xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Danh Mục Sản Phẩm</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {allCategories
            .filter((cat) => !cat.parentId) // chỉ hiển thị category cha
            .map((category) => (
              <CategoryCard key={typeof category._id === "object" ? category._id["$oid"] : category._id} category={category} />
            ))}
        </div>
      </div>

      {categories.map((cat, index) => (
        <React.Fragment key={cat._id.toString()}>
          <CategorySection title={cat.title} description={cat.description} products={cat.products || []} categorySlug={cat.slug} align="left" />

          {/* Sau 2 section thì chèn ImageCollage */}
          {index === 1 && (
            <ImageCollage
              images={[
                "/images/gallery/1.webp",
                "/images/gallery/2.webp",
                "/images/gallery/3.webp",
                "/images/gallery/4.webp",
                "/images/gallery/5.webp",
                "/images/gallery/6.webp",
              ]}
            />
          )}
          {index === 3 && (
            <ImageCollage
              images={[
                "/images/gallery/7.webp",
                "/images/gallery/8.webp",
                "/images/gallery/9.webp",
                "/images/gallery/10.webp",
                "/images/gallery/11.webp",
                "/images/gallery/12.webp",
              ]}
            />
          )}
        </React.Fragment>
      ))}

      <BlogSection />
      <FeedbackForm />
    </>
  );
};

export default Home;
