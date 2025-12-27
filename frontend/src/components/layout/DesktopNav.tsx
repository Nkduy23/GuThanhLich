// src/components/layout/DesktopNav.tsx
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { memo, useCallback } from "react";
import type { Category } from "@/types/category";

const DesktopNav = memo(({ categories }: { categories: Category[] }) => {
  const mainCategories = categories.filter((cat) => cat.parentSlug === null);

  const getSubCategories = useCallback(
    (parentSlug: string) => categories.filter((cat) => cat.parentSlug === parentSlug),
    [categories]
  );

  const renderMegaMenu = (subs: Category[]) => (
    <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-auto min-w-[600px] bg-white shadow-xl rounded-lg p-6 z-50 border border-gray-100">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {subs.map((sub) => (
          <div key={sub.slug}>
            <Link
              to={`/category/${sub.slug}`}
              className="font-semibold text-gray-900 hover:text-blue-600 transition-colors block mb-2"
            >
              {sub.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDropdown = (subs: Category[]) => (
    <div className="absolute left-0 top-full mt-2 hidden group-hover:block w-56 bg-white shadow-xl rounded-lg py-2 z-50 border border-gray-100">
      {subs.map((sub) => (
        <Link
          key={sub.slug}
          to={`/category/${sub.slug}`}
          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
          {sub.name}
          <ChevronRight className="w-4 h-4" />
        </Link>
      ))}
    </div>
  );

  return (
    <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
      {mainCategories.map((cat) => {
        const subs = getSubCategories(cat.slug);
        const isMegaMenu = ["ao", "quan", "phu-kien"].includes(cat.slug); // Tùy chỉnh theo slug thực tế

        return (
          <div key={cat.slug} className="group relative">
            <Link
              to={`/category/${cat.slug}`}
              className="flex items-center gap-1 px-3 py-2 text-sm lg:text-base text-gray-700 hover:text-blue-600 font-medium uppercase transition-colors rounded-lg hover:bg-gray-50"
            >
              {cat.name}
              {subs.length > 0 && (
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              )}
            </Link>

            {subs.length > 0 && (isMegaMenu ? renderMegaMenu(subs) : renderDropdown(subs))}
          </div>
        );
      })}
    </nav>
  );
});

DesktopNav.displayName = "DesktopNav";
export default DesktopNav;
