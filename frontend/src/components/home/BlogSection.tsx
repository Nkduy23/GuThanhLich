import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Blog } from "../../types";

const BlogSection: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/blogs");
        const data = await response.json();
        setBlogs(data.blogs || []); // giả sử API trả { blogs: [...] }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Bài viết mới</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog._id}
            to={`/blog/${blog.slug}`}
            className="block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <img src={blog.thumbnail} alt={blog.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mt-2">{blog.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;
