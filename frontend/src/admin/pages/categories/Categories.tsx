import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Category } from "../../../types";
import { buildCategoryTree } from "../../../utils/categoryTree";
import CategoryItem from "../../components/categories/CategoryTree";

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [parents, setParents] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("all");
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const tree = buildCategoryTree(categories);

  // fetch categories
  useEffect(() => {
    fetch("http://localhost:3000/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        const all = data.categories;
        setCategories(all);
        setParents(all.filter((c: Category) => !c.parentSlug));
      });
  }, []);

  const filteredTree =
    selectedParent === "all" ? tree : tree.filter((t) => t.slug === selectedParent);
  const mainCount = categories.filter((c) => !c.parentId).length;
  const subCount = categories.filter((c) => c.parentId).length;
  const totalProducts = categories.reduce((sum, c) => sum + (c.productCount || 0), 0);

  // delete category
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/admin/categories/${id}`, {
      method: "DELETE",
    });
    setCategories(categories.filter((c) => c._id !== id));
  };

  // Navigate to edit page
  const handleEditClick = (cat: Category) => {
    navigate(`/admin/categories/edit/${cat._id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Categories</h1>

        {/* Button Add */}
        <button
          onClick={() => navigate("/admin/categories/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Category
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Parent</label>
        <select
          onChange={(e) => setSelectedParent(e.target.value)}
          className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
        >
          <option value="all">All</option>
          {parents.map((p) => (
            <option key={p._id} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Main Categories</h3>
          <p className="text-2xl font-semibold text-gray-800">{mainCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Sub Categories</h3>
          <p className="text-2xl font-semibold text-gray-800">{subCount}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-semibold text-gray-800">{totalProducts}</p>
        </div>
      </div>

      {/* Categories list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTree.map((cat) => (
          <CategoryItem
            key={cat._id}
            cat={cat}
            onEdit={handleEditClick}
            onDelete={(id) => {
              const toDelete = filteredTree.find((c) => c._id === id);
              if (toDelete) setDeleteCategory(toDelete);
            }}
          />
        ))}
      </div>

      {/* Confirm Delete Modal */}
      {deleteCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h2 className="text-lg font-semibold mb-4">Xác nhận xoá</h2>
            <p className="mb-6">
              Bạn có chắc muốn xoá <span className="font-bold">{deleteCategory.name}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteCategory(null)} className="px-4 py-2 rounded border">
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDelete(deleteCategory._id);
                  setDeleteCategory(null);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
