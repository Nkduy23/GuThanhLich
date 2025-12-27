// src/components/layout/MobileNav/MobileNav.tsx
import { Link } from "react-router-dom";
import { X, ChevronDown } from "lucide-react";
import { memo, useState, useCallback } from "react";
import type { Category } from "@/types/category";

import MobileNavOverlay from "./MobileNavOverlay";

interface MobileNavProps {
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav = memo(({ categories, isOpen, onClose }: MobileNavProps) => {
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());

  const mainCategories = categories.filter((cat) => cat.parentSlug === null);

  const getSubCategories = useCallback(
    (parentSlug: string) => categories.filter((cat) => cat.parentSlug === parentSlug),
    [categories]
  );

  const toggleCategory = (slug: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  return (
    <>
      <MobileNavOverlay isOpen={isOpen} onClose={onClose} />

      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl overflow-y-auto md:hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="p-4">
            {mainCategories.map((cat) => {
              const subs = getSubCategories(cat.slug);
              const isOpenSub = openCategories.has(cat.slug);

              return (
                <div key={cat.slug} className="mb-2">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="flex-1 py-3 text-gray-800 hover:text-blue-600 font-medium uppercase text-sm transition-colors"
                    >
                      {cat.name}
                    </Link>
                    {subs.length > 0 && (
                      <button
                        onClick={() => toggleCategory(cat.slug)}
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        aria-label={`Mở/đóng danh mục ${cat.name}`}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            isOpenSub ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {isOpenSub && subs.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                      {subs.map((sub) => (
                        <Link
                          key={sub.slug}
                          to={`/category/${sub.slug}`}
                          onClick={onClose}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
});

MobileNav.displayName = "MobileNav";
export default MobileNav;
