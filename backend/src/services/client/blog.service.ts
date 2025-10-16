import Blog from "../../models/Blog";

export const getBlogs = async () => {
  const blogs = await Blog.find().lean();
  return blogs;
};
