import type { categorySection } from "@client/types";
import ProductCarousel from "../product/ProductCarousel";
import ViewMoreButton from "./ViewMoreButton";

interface CategorySectionProps {
  categorySection: categorySection;
  align?: "center" | "left";
}

const CategorySection: React.FC<CategorySectionProps> = ({ categorySection, align = "center" }) => {
  return (
    <div className="category mb-12 mx-auto max-w-7xl px-4 container">
      <div className={`text-${align} mb-8`}>
        <h2 className="text-3xl font-semibold uppercase mb-2 mt-8">{categorySection.title}</h2>
        {categorySection.description && (
          <p className="text-gray-600">{categorySection.description}</p>
        )}
      </div>
      <div>
        <ProductCarousel
          products={categorySection.products.slice(0, 10)}
          categorySlug={categorySection.slug}
        />
        <ViewMoreButton categorySlug={categorySection.slug} />
      </div>
    </div>
  );
};

export default CategorySection;
