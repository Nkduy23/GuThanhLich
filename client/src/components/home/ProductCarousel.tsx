import type { Product } from "../../types";
import CardProduct from "../product/CardProduct";
import { useRef } from "react";

interface ProductCarouselProps {
  products: Product[];
  categorySlug: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
  const carouseRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (carouseRef.current) {
      const scrollAmount = 250;
      carouseRef.current.scrollLeft += direction === "right" ? scrollAmount : -scrollAmount;
    }
  };

  return (
    <div className="relative">
      <div ref={carouseRef} className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth space-x-6 pr-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="
    w-[calc(50%-0.75rem)] 
    sm:w-[calc(33.333%-1rem)] 
    lg:w-[calc(25%-1.125rem)] 
    flex-shrink-0
  "
          >
            <CardProduct product={product} />
          </div>
        ))}
      </div>
      <button onClick={() => scroll("left")} className="absolute -left-6 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow">
        {/* Icon trái */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7L10 12L15 17" stroke="#272626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={() => scroll("right")} className="absolute -right-6 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow rotate-180">
        {/* Icon phải */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7L10 12L15 17" stroke="#272626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default ProductCarousel;
