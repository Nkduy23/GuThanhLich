import { useState } from "react";
import type { Category } from "@/types";

const CategoryItem: React.FC<{
  cat: Category;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}> = ({ cat, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div onClick={() => onEdit(cat)} className="flex-1 cursor-pointer group">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                {cat.name}
              </h2>
              {cat.children.length > 0 && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                  {cat.children.length} sub
                </span>
              )}
              <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded">
                {cat.productCount} sản phẩm
              </span>
              {cat.isFeatured && (
                <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  ⭐ Featured
                </span>
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span className="text-gray-400">🔗</span>
                <span className="font-mono bg-gray-50 px-2 py-0.5 rounded text-xs">{cat.slug}</span>
              </p>

              {cat.parentSlug && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span>↳</span>
                  <span>
                    Child of <span className="font-medium text-gray-700">{cat.parentSlug}</span>
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cat.children.length > 0 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors font-semibold text-lg"
              >
                {expanded ? "−" : "+"}
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(cat._id);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              title="Delete category"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Render children khi expanded */}
      {expanded && cat.children.length > 0 && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="ml-8 py-3 pr-3 space-y-2 border-l-2 border-blue-300">
            {cat.children.map((child: Category) => (
              <CategoryItem key={child._id} cat={child} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryItem;
