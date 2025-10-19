import { Link } from "react-router-dom";
import { Fragment } from "react";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Component render breadcrumb từ items
export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav aria-label="Breadcrumb" className="text-sm text-gray-600 my-4">
    <ol className="flex flex-wrap items-center gap-1">
      {items.map((item, idx) => (
        <Fragment key={idx}>
          {item.href ? (
            <Link to={item.href} className="hover:text-blue-600 transition-colors">
              {" "}
              {/* Dùng 'to' nếu React Router */}
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <span className="mx-1 text-gray-400">
              <ChevronRight size={14} />
            </span>
          )}
        </Fragment>
      ))}
    </ol>
  </nav>
);

/**
 * Tạo items breadcrumb động từ categories + product name
 */
// eslint-disable-next-line react-refresh/only-export-components
export const generateBreadcrumb = (
  categories: { name: string; href: string }[], // Array categories từ product.category (có thể recursive nếu lồng)
  productName?: string
): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [{ label: "Trang chủ", href: "/" }];

  categories.forEach((c) => items.push({ label: c.name, href: c.href }));

  if (productName) {
    items.push({ label: productName }); // Không href cho product (active)
  }

  return items;
};
