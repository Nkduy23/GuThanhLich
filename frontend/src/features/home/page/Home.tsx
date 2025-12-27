import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryCard from "@/features/home/components/CategoryCard";
import CategorySection from "@/features/home/components/CategorySection";
import BlogSection from "@/features/home/components/BlogSection";
import FeedbackForm from "@/features/home/components/FeedbackForm";
import ImageCollage from "@/features/home/components/ImageCollage";
import { apiRequest } from "@/api/fetcher";
import { ENDPOINTS } from "@/api/endpoints";
import { imageCollages } from "@/features/data/imageCollageData";
import type { parentCategories, categorySection, Blog } from "@/features/types";

const Home = () => {
  const [allCategories, setAllCategories] = useState<parentCategories[]>([]);
  const [categories, setCategories] = useState<categorySection[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiRequest<{
          data: {
            parentCategories: parentCategories[];
            categoryProducts: categorySection[];
            blogs: Blog[];
          };
        }>(ENDPOINTS.home);

        setAllCategories(res.data.parentCategories || []);
        setCategories(res.data.categoryProducts || []);
        setBlogs(res.data.blogs || []);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu trang Home");
        console.error("Error fetching data home:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="category mb-12 mx-auto max-w-7xl px-4 container">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">Danh Mục Sản Phẩm</h2>
        </div>
        <div
          className={`flex items-center justify-center flex-wrap gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12`}
        >
          {allCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>

      {categories.map((cat, index) => (
        <React.Fragment key={cat._id.toString()}>
          <CategorySection categorySection={cat} />

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
