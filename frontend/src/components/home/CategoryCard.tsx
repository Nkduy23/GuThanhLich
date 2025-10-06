import type { Category } from "../../types";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link to={`/category/${category.slug}`} className="block text-center">
      <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg mb-2" />
      <h3 className="text-lg font-semibold">{category.name}</h3>
    </Link>
  );
};

export default CategoryCard;
