import { Link } from "react-router-dom";
import React from "react";
import type { Blog } from "../../../types";

interface BlogSectionProps {
  blogs: Blog[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
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
