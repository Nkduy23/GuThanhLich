import { useEffect, useState } from "react";
import type { Category, Blog } from "../../types";
import { apiRequest } from "../../api/fetcher";
import { ENDPOINTS } from "../../api/endpoints";
import CategoryCard from "../components/home/CategoryCard";
import CategorySection from "../components/home/CategorySection";
import BlogSection from "../components/home/BlogSection";
import FeedbackForm from "../components/home/FeedbackForm";
import ImageCollage from "../components/home/ImageCollage";
import React from "react";
import { imageCollages } from "../data/imageCollageData";

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest<{
          data: { categoryProducts: Category[]; parentCategories: Category[]; blogs: Blog[] };
        }>(ENDPOINTS.home);

        setCategories(res.data.categoryProducts || []);
        setAllCategories(res.data.parentCategories || []);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error("Error fetching data home:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {/* Danh mục sản phẩm */}
      <div className="category mb-12 mx-auto max-w-6xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Danh Mục Sản Phẩm</h2>
        </div>
        <div
          className={`grid gap-6 ${
            allCategories.length <= 6
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 justify-items-center"
              : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
          }`}
        >
          {allCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>

      {categories.map((cat, index) => (
        <React.Fragment key={cat._id.toString()}>
          <CategorySection
            title={cat.title}
            description={cat.description}
            products={cat.products || []}
            categorySlug={cat.slug}
            align="left"
          />

          {/* Sau 2 section thì chèn ImageCollage */}
          {index === 1 && <ImageCollage images={imageCollages[0]} />}
          {index === 3 && <ImageCollage images={imageCollages[1]} />}
        </React.Fragment>
      ))}

      <BlogSection blogs={blogs} />
      <FeedbackForm />
    </>
  );
};

export default Home;
