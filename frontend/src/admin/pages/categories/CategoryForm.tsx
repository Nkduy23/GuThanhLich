import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Category } from "../../../types";

const CategoryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    title: "",
    description: "",
    slug: "",
    image: "",
    parentId: null,
    parentSlug: null,
    isFeatured: false,
    order: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all categories for parent dropdown
  useEffect(() => {
    fetch("http://localhost:3000/admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Failed to fetch categories", err);
      });
  }, []);

  // Fetch category data if editing
  useEffect(() => {
    if (isEditMode && id) {
      setLoading(true);
      fetch(`http://localhost:3000/admin/categories/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data.category);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch category", err);
          setError("Failed to load category");
          setLoading(false);
        });
    }
  }, [isEditMode, id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "parentId") {
      const parentId = value || null;
      const parentSlug = value ? categories.find((c) => c._id === value)?.slug || null : null;
      setFormData((prev) => ({ ...prev, parentId, parentSlug }));
    } else if (name === "order") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.slug) {
      setError("Name and Slug are required");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        // Update
        const res = await fetch(`http://localhost:3000/admin/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Update failed");
        }
      } else {
        // Create
        const res = await fetch("http://localhost:3000/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          throw new Error("Create failed");
        }
      }

      navigate("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/categories")}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Back to Categories
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Category" : "Add New Category"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              rows={4}
            />
          </div>

          {/* Slug */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Image URL */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Parent Category */}
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Parent Category</label>
            <select
              name="parentId"
              value={formData.parentId || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              <option value="">-- None (Root) --</option>
              {categories
                .filter((c) => c._id !== id) // Prevent selecting itself as parent
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Is Featured */}
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured || false}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>
          </div>

          {/* Order */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Order</label>
            <input
              type="number"
              name="order"
              value={formData.order || 0}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
