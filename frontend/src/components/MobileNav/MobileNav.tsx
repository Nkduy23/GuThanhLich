// src/components/layout/MobileNav/MobileNav.tsx
import { Link } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { memo, useState } from "react";
import type { Category } from "@/types/category";

import MobileNavOverlay from "./MobileNavOverlay";

interface MobileNavProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileNavItem = memo(
  ({
    cat,
    categories,
    onClose,
    level = 0,
  }: {
    cat: Category;
    categories: Category[];
    onClose: () => void;
    level?: number;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const children = categories.filter((c) => c.parentSlug === cat.slug);
    const hasChildren = children.length > 0;

    return (
      <div className={level > 0 ? "ml-4" : ""}>
        <div className="flex items-center justify-between">
          <Link
            to={`/category/${cat.slug}`}
            onClick={onClose}
            className={`flex-1 py-3 text-sm transition-colors ${
              level === 0
                ? "font-medium uppercase text-gray-800 hover:text-blue-600"
                : level === 1
                ? "font-semibold text-gray-700"
                : "text-gray-600"
            }`}
          >
            {cat.name}
          </Link>

          {hasChildren && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="border-l-2 border-gray-200 pl-4 mt-1 space-y-1">
            {children.map((child) => (
              <MobileNavItem
                key={child.slug}
                cat={child}
                categories={categories}
                onClose={onClose}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

MobileNavItem.displayName = "MobileNavItem";

const MobileNav = memo(({ categories, isOpen, onClose }: MobileNavProps) => {
  const mainCategories = categories.filter((cat) => cat.parentSlug === null);

  return (
    <>
      <MobileNavOverlay isOpen={isOpen} onClose={onClose} />

      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4 space-y-3">
            {mainCategories.map((cat) => (
              <MobileNavItem
                key={cat.slug}
                cat={cat}
                categories={categories}
                onClose={onClose}
                level={0}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
});

MobileNav.displayName = "MobileNav";
export default MobileNav;
