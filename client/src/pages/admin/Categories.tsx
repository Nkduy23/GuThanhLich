import { useEffect, useState } from "react";
import type { Category } from "../../types";
import { buildCategoryTree } from "../../utils/categoryTree";
import CategoryItem from "../../components/admin/categories/CategoryTree";

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parents, setParents] = useState<Category[]>([]);
  const [selectedParent, setSelectedParent] = useState<string>("all");
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const tree = buildCategoryTree(categories);

  // Modal edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // const { _id, children, ...payload } = editCategory;

  // if (!payload.parentId) {
  //   delete payload.parentId;
  // }

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

  // filter
  // const filtered = categories.filter((c) => (selectedParent === "all" ? true : c.parentSlug === selectedParent));

  const filteredTree = selectedParent === "all" ? tree : tree.filter((t) => t.slug === selectedParent);

  // delete category
  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3000/admin/categories/${id}`, {
      method: "DELETE",
    });
    setCategories(categories.filter((c) => c._id !== id));
  };

  // open modal to edit
  const handleEditClick = (cat: Category) => {
    setEditCategory(cat);
    setIsModalOpen(true);
  };

  // update category
  const handleSave = async () => {
    if (!editCategory) return;

    if (editCategory._id) {
      // update
      const res = await fetch(`http://localhost:3000/admin/categories/${editCategory._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCategory),
      });

      if (!res.ok) {
        console.error("Update failed", await res.text());
        return;
      }

      const updated = await res.json();
      setCategories(categories.map((c) => (c._id === updated._id ? updated : c)));
    } else {
      // create
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...newCatData } = editCategory;

      if (!newCatData.name || !newCatData.slug) {
        alert("Name and Slug are required");
        return;
      }

      const res = await fetch("http://localhost:3000/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCatData),
      });

      if (!res.ok) {
        console.error("Create failed", await res.text());
        return;
      }

      const newCat = await res.json();
      setCategories([...categories, newCat]);
    }

    setIsModalOpen(false);
    setEditCategory(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Categories</h1>

      {/* Button Add */}
      <div className="mb-6">
        <button
          onClick={() => {
            setEditCategory({
              _id: "",
              name: "",
              title: "",
              description: "",
              slug: "",
              // type: "",
              image: "",
              parentId: null,
              parentSlug: null,
              isFeatured: false,
              order: 0,
              children: [],
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
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

      {/* Categories list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTree.map((cat) => (
          // <CategoryItem key={cat._id} cat={cat} onEdit={handleEditClick} onDelete={handleDelete} />
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
                  handleDelete(deleteCategory._id); // gọi thật sự
                  setDeleteCategory(null);
                }}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {isModalOpen && editCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">{editCategory && editCategory._id ? "Edit Category" : "Add Category"}</h2>
            {/* name */}
            <label className="block mb-2 text-sm font-medium">Name</label>
            <input
              type="text"
              value={editCategory.name}
              onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            {/* title */}
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              value={editCategory.title || ""}
              onChange={(e) => setEditCategory({ ...editCategory, title: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            {/* description */}
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              value={editCategory.description || ""}
              onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
              rows={3}
            />
            {/* slug */}
            <label className="block mb-2 text-sm font-medium">Slug</label>
            <input
              type="text"
              value={editCategory.slug}
              onChange={(e) => setEditCategory({ ...editCategory, slug: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            {/* type */}
            {/* <label className="block mb-2 text-sm font-medium">Type</label>
            <select
              value={editCategory.type || ""}
              onChange={(e) => setEditCategory({ ...editCategory, type: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">-- Select Type --</option>
              <option value="sale">Sale</option>
              <option value="style">Gu</option>
              <option value="ao">Áo</option>
              <option value="quan">Áo</option>
              <option value="phu-kien">Áo</option>
              <option value="new">New</option>
            </select> */}
            {/* image */}
            <label className="block mb-2 text-sm font-medium">Image URL</label>
            <input
              type="text"
              value={editCategory.image || ""}
              onChange={(e) => setEditCategory({ ...editCategory, image: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            {/* parentSlug */}
            <label className="block mb-2 text-sm font-medium">Parent Category</label>
            <select
              value={editCategory.parentId || ""}
              onChange={(e) =>
                setEditCategory({
                  ...editCategory,
                  parentId: e.target.value,
                  parentSlug: categories.find((c) => c._id === e.target.value)?.slug || "",
                })
              }
              className="w-full border px-3 py-2 rounded mb-3"
            >
              <option value="">-- None (Root) --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {/* isFeatured */}
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={editCategory.isFeatured || false}
                onChange={(e) => setEditCategory({ ...editCategory, isFeatured: e.target.checked })}
              />
              Featured
            </label>
            {/* order */}
            <label className="block mb-2 text-sm font-medium">Order</label>
            <input
              type="number"
              value={editCategory.order || 0}
              onChange={(e) => setEditCategory({ ...editCategory, order: Number(e.target.value) })}
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditCategory(null);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
