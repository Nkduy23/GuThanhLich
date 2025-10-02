import { Link } from "react-router-dom";

const BlogSection: React.FC = () => {
  // Data giả định
  const blogs = [
    {
      _id: "1",
      title: "Cách phối áo thun thể thao đơn giản mà đẹp",
      excerpt: "Áo thun thể thao không chỉ thoải mái mà còn dễ phối đồ...",
      thumbnail: "/images/blogs/blog1.webp",
      slug: "cach-phoi-ao-thun-the-thao",
    },
    {
      _id: "2",
      title: "5 mẹo giữ quần áo luôn bền màu",
      excerpt: "Bảo quản quần áo đúng cách giúp tiết kiệm chi phí...",
      thumbnail: "/images/blogs/blog2.webp",
      slug: "meo-giu-quan-ao-ben-mau",
    },
    {
      _id: "3",
      title: "5 mẹo giữ quần áo luôn bền màu",
      excerpt: "Bảo quản quần áo đúng cách giúp tiết kiệm chi phí...",
      thumbnail: "/images/blogs/blog2.webp",
      slug: "meo-giu-quan-ao-ben-mau",
    },
    {
      _id: "4",
      title: "5 mẹo giữ quần áo luôn bền màu",
      excerpt: "Bảo quản quần áo đúng cách giúp tiết kiệm chi phí...",
      thumbnail: "/images/blogs/blog2.webp",
      slug: "meo-giu-quan-ao-ben-mau",
    },
  ];

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
