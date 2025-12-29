import type { parentCategories } from "@/features/types";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: parentCategories;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`} className="block text-center">
      <img
        src={`${import.meta.env.VITE_API_URL}${category.image}`}
        onError={(e) => {
          e.currentTarget.src = category.image;
        }}
        alt={category.name}
        className="w-30 object-cover rounded-lg mb-2"
      />
      <h3 className="text-lg font-semibold">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;
