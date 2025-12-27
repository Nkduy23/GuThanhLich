import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { memo, useCallback } from "react";
import type { Category } from "@/types/category";

const DesktopNav = memo(({ categories }: { categories: Category[] }) => {
  const mainCategories = categories.filter((cat) => cat.parentSlug === null);

  const getChildren = useCallback(
    (parentSlug: string | null) => categories.filter((cat) => cat.parentSlug === parentSlug),
    [categories]
  );

  // Render một cột: tiêu đề cấp 2 + danh sách cấp 3
  const renderMegaMenuColumn = (level2Cat: Category) => {
    const level3Cats = getChildren(level2Cat.slug);

    return (
      <div key={level2Cat.slug} className="flex gap-2 flex-col w-full">
        <Link
          to={`/category/${level2Cat.slug}`}
          className="font-bold text-gray-900 hover:text-blue-600 block mb-4 text-base transition-colors"
        >
          {level2Cat.name}
        </Link>
        {level3Cats.length > 0 && (
          <ul className="space-y-2">
            {level3Cats.map((level3) => (
              <li key={level3.slug}>
                <Link
                  to={`/category/${level3.slug}`}
                  className="text-gray-600 hover:text-blue-600 text-sm block py-1 transition-colors"
                >
                  {level3.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Render toàn bộ mega menu cho một main category
  const renderMegaMenu = (mainCat: Category) => {
    const level2Cats = getChildren(mainCat.slug);
    if (level2Cats.length === 0) return null;

    // Tính số cột tối ưu dựa trên số lượng items
    const columnCount = Math.min(level2Cats.length, 5); // Tối đa 5 cột
    const gridClass = `grid gap-8`;
    const gridStyle = {
      gridTemplateColumns: `repeat(${columnCount}, minmax(180px, 1fr))`,
    };

    return (
      <div className="absolute left-0 top-full bg-white shadow-2xl rounded-lg p-8 z-50 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
        <div className={gridClass} style={gridStyle}>
          {level2Cats.map((level2) => renderMegaMenuColumn(level2))}
        </div>
      </div>
    );
  };

  return (
    <nav className="hidden lg:flex items-center space-x-8">
      {mainCategories.map((cat) => {
        const hasChildren = getChildren(cat.slug).length > 0;

        return (
          <div key={cat.slug} className="group relative">
            {/* Parent Link */}
            <Link
              to={`/category/${cat.slug}`}
              className="flex items-center gap-1.5 px-3 py-2 text-base font-medium uppercase text-gray-700 hover:text-blue-600 transition-colors"
            >
              {cat.name}
              {hasChildren && (
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
              )}
            </Link>

            {/* Mega Menu - Chỉ hiện khi hover */}
            {hasChildren && renderMegaMenu(cat)}
          </div>
        );
      })}
    </nav>
  );
});

DesktopNav.displayName = "DesktopNav";
export default DesktopNav;
