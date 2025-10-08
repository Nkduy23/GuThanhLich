import type { Product } from "../../../types";
import ProductCarousel from "../product/ProductCarousel";
import ViewMoreButton from "./ViewMoreButton";

interface CategorySectionProps {
  title: string;
  description?: string;
  products: Product[];
  categorySlug: string;
  align?: "center" | "left";
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  description,
  products,
  categorySlug,
  align = "center",
}) => {
  return (
    <div className="category mb-12 mx-auto max-w-6xl px-4 container">
      <div className={`text-${align} mb-8`}>
        <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      <div>
        <ProductCarousel products={products.slice(0, 10)} categorySlug={categorySlug} />
        <ViewMoreButton categorySlug={categorySlug} />
      </div>
    </div>
  );
};

export default CategorySection;
