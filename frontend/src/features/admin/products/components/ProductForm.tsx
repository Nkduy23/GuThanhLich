// admin/ProductFormPage.tsx (updated for file uploads)
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  Category,
  ProductForm,
  ProductVariant,
  ProductSpecifications,
  ProductHighlights,
  Brand,
  Size,
} from "@admin/types";

// Common size options
const SIZE_OPTIONS = ["S", "M", "L", "XL", "XXL", "XXXL"];

// Common color options
const COLOR_OPTIONS = [
  { en: "Black", vi: "Đen" },
  { en: "White", vi: "Trắng" },
  { en: "Blue", vi: "Xanh dương" },
  { en: "Red", vi: "Đỏ" },
  { en: "Green", vi: "Xanh lá" },
  { en: "Yellow", vi: "Vàng" },
  { en: "Gray", vi: "Xám" },
  { en: "Pink", vi: "Hồng" },
  { en: "Navy", vi: "Xanh navy" },
  { en: "Beige", vi: "Be" },
];

// Spec key suggestions
const SPEC_KEY_SUGGESTIONS = [
  "Chất liệu",
  "Kiểu dáng",
  "Cổ áo",
  "Tay áo",
  "Màu sắc",
  "Xuất xứ",
  "Hướng dẫn giặt",
  "Độ dày vải",
  "Trọng lượng",
  "Phong cách",
];

const ProductFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [form, setForm] = useState<Partial<ProductForm>>({});
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Track selected files for upload
  const [currentUploadVariantIndex, setCurrentUploadVariantIndex] = useState<number>(0);

  // Fetch categories
  useEffect(() => {
    fetch("http://localhost:3000/admin/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  // Fetch brands
  useEffect(() => {
    fetch("http://localhost:3000/admin/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.brands || []))
      .catch((err) => console.error("Error loading brands:", err));
  }, []);

  // Fetch product if editing
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/admin/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const productData = data.product || {};
        setForm({
          ...productData,
          categoryId: productData.categoryId?._id || "",
          brandId: productData.brandId?._id || "",
          productSpecifications: productData.productSpecifications || [],
          productHighlights: productData.productHighlights || [],
          productVariants: productData.productVariants || [],
          tags: Array.isArray(productData.tags) ? productData.tags : [],
        });
      })
      .catch((err) => console.error("Error loading product:", err));
  }, [id]);

  // Handle simple field change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle tags change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, tags }));
  };

  // Product specs handlers
  const updateSpec = (index: number, field: "key" | "value", value: string) => {
    setForm((prev) => ({
      ...prev,
      productSpecifications: (prev.productSpecifications || []).map(
        (spec: ProductSpecifications, i: number) =>
          i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const addSpec = () => {
    setForm((prev) => ({
      ...prev,
      productSpecifications: [...(prev.productSpecifications || []), { key: "", value: "" }],
    }));
  };

  const removeSpec = (index: number) => {
    setForm((prev) => ({
      ...prev,
      productSpecifications: (prev.productSpecifications || []).filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  // Product highlights handlers
  const updateHighlight = (index: number, field: "title" | "description", value: string) => {
    setForm((prev) => ({
      ...prev,
      productHighlights: (prev.productHighlights || []).map(
        (highlight: ProductHighlights, i: number) =>
          i === index ? { ...highlight, [field]: value } : highlight
      ),
    }));
  };

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      productHighlights: [...(prev.productHighlights || []), { title: "", description: "" }],
    }));
  };

  const removeHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      productHighlights: (prev.productHighlights || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // Product variants handlers
  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    if (field === "sizes" || field === "images") return;
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map((variant: ProductVariant, i: number) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const updateVariantSize = (
    variantIndex: number,
    sizeIndex: number,
    field: "size" | "quantity",
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map(
        (variant: ProductVariant, vIndex: number) => {
          if (vIndex !== variantIndex) return variant;
          const newSizes =
            variant.sizes?.map((size: Size, sIndex: number) =>
              sIndex === sizeIndex ? { ...size, [field]: value } : size
            ) || [];
          return { ...variant, sizes: newSizes };
        }
      ),
    }));
  };

  const addVariantSize = (variantIndex: number) => {
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map(
        (variant: ProductVariant, vIndex: number) => {
          if (vIndex !== variantIndex) return variant;
          return { ...variant, sizes: [...(variant.sizes || []), { size: "M", quantity: 0 }] };
        }
      ),
    }));
  };

  const removeVariantSize = (variantIndex: number, sizeIndex: number) => {
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map(
        (variant: ProductVariant, vIndex: number) => {
          if (vIndex !== variantIndex) return variant;
          const newSizes =
            variant.sizes?.filter((_: any, sIndex: number) => sIndex !== sizeIndex) || [];
          return { ...variant, sizes: newSizes };
        }
      ),
    }));
  };

  // Updated: Handle file selection (appends to first variant for simplicity; enhance for per-variant if needed)
  const handleFileSelect = (variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      // Add placeholder previews to the specific variant
      setForm((prev) => {
        const variants = prev.productVariants || [];
        if (variants.length > variantIndex) {
          const targetVariant = variants[variantIndex];
          const placeholderImages = newFiles.map((f) => URL.createObjectURL(f)); // Temp URL for preview
          return {
            ...prev,
            productVariants: [
              ...variants.slice(0, variantIndex),
              {
                ...targetVariant,
                images: [...(targetVariant.images || []), ...placeholderImages],
              },
              ...variants.slice(variantIndex + 1),
            ],
            uploadVariantIndex: variantIndex, // Track for backend
          };
        }
        return prev;
      });
      // Clear input
      e.target.value = "";
    }
  };

  const removeImageFromVariant = (variantIndex: number, imageIndex: number) => {
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).map(
        (variant: ProductVariant, vIndex: number) => {
          if (vIndex !== variantIndex) return variant;
          const newImages = variant.images?.filter((_: any, i: number) => i !== imageIndex) || [];
          return { ...variant, images: newImages };
        }
      ),
    }));
    // Remove corresponding file if it's a new one (approximate by removing last)
    setSelectedFiles((prev) => {
      if (prev.length > 0) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      productVariants: [
        ...(prev.productVariants || []),
        { color: "Black", colorNameVi: "Đen", sizes: [], images: [], is_active: true },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      productVariants: (prev.productVariants || []).filter((_: any, i: number) => i !== index),
    }));
  };

  // Handle submit with FormData for files
  // Handle submit with FormData for files
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id
        ? `http://localhost:3000/admin/products/${id}`
        : `http://localhost:3000/admin/products`;

      // Derive slugs from selected category and brand
      const selectedCategory = categories.find((c) => c._id === form.categoryId);
      const selectedBrand = brands.find((b) => b._id === form.brandId);

      const submitData = {
        ...form,
        categoryId: form.categoryId,
        brandId: form.brandId,
        categorySlug: selectedCategory?.slug || form.categorySlug || "",
        brandSlug: selectedBrand?.slug || form.brandSlug || "",
        uploadVariantIndex: form.uploadVariantIndex || 0, // Include for backend
        ...(id ? {} : { is_new: true }), // Only set is_new for create
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(submitData));
      // selectedFiles.forEach((file) => {
      //   formData.append("variantImages", file);
      // });

      const res = await fetch(url, {
        method,
        body: formData, // No Content-Type, let browser set multipart
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      navigate("/admin/products");
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product");
    } finally {
      setLoading(false);
      setSelectedFiles([]); // Clear after submit
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/products")}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
          >
            ← Back to Products
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {id ? "Edit Product" : "Create New Product"}
          </h1>
          <p className="text-gray-600 mt-2">
            {id ? "Update product information below" : "Fill in the details to add a new product"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm">
                1
              </span>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name || ""}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="e.g., Áo Thun Pique Thoáng Mát"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  name="slug"
                  value={form.slug || ""}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="ao-thun-pique-thoang"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={form.code || ""}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="PRD001"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="price"
                    value={form.price || ""}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="1299000"
                    required
                  />
                  <span className="absolute right-4 top-3 text-gray-500">₫</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sale (%) - Optional
                </label>
                <input
                  type="number"
                  name="sale"
                  value={form.sale || ""}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="10"
                  min={0}
                  max={100}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                <select
                  name="brandId"
                  value={form.brandId}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                  required
                >
                  <option value="">-- Select Brand --</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="Describe your product..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
                  onChange={handleTagsChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  placeholder="ao-thun-co-tron-tay-ngan, tram-thiet-yeu"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={!!form.is_active}
                  onChange={(e) => handleCheckboxChange("is_active", e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-200"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">
                  Product is Active (visible to customers)
                </label>
              </div>
            </div>
          </div>
          {/* Product Specifications Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm">
                2
              </span>
              Product Specifications
            </h2>
            <div className="space-y-4">
              {(form.productSpecifications || []).map(
                (spec: ProductSpecifications, index: number) => (
                  <div
                    key={spec._id || index}
                    className="border-2 border-gray-200 rounded-xl p-5 hover:border-green-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Key</label>
                        <input
                          type="text"
                          list={`spec-keys-${index}`}
                          value={spec.key || ""}
                          onChange={(e) => updateSpec(index, "key", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="e.g., Chất liệu"
                        />
                        <datalist id={`spec-keys-${index}`}>
                          {SPEC_KEY_SUGGESTIONS.map((key) => (
                            <option key={key} value={key} />
                          ))}
                        </datalist>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Value
                        </label>
                        <input
                          type="text"
                          value={spec.value || ""}
                          onChange={(e) => updateSpec(index, "value", e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-200"
                          placeholder="e.g., Cotton 100%"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="mt-3 text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      × Remove Specification
                    </button>
                  </div>
                )
              )}
              <button
                type="button"
                onClick={addSpec}
                className="w-full border-2 border-dashed border-green-300 rounded-xl px-4 py-3 text-green-600 hover:bg-green-50 font-medium transition-colors"
              >
                + Add Specification
              </button>
            </div>
          </div>
          {/* Product Highlights Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm">
                3
              </span>
              Product Highlights
            </h2>
            <div className="space-y-4">
              {(form.productHighlights || []).map((highlight: ProductHighlights, index: number) => (
                <div
                  key={highlight._id || index}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-purple-300 transition-colors"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={highlight.title || ""}
                      onChange={(e) => updateHighlight(index, "title", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="e.g., CO GIÃN 4 CHIỀU"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={highlight.description || ""}
                      onChange={(e) => updateHighlight(index, "description", e.target.value)}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                      placeholder="Describe this highlight..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="mt-3 text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    × Remove Highlight
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHighlight}
                className="w-full border-2 border-dashed border-purple-300 rounded-xl px-4 py-3 text-purple-600 hover:bg-purple-50 font-medium transition-colors"
              >
                + Add Highlight
              </button>
            </div>
          </div>
          // Updated JSX for Product Variants Card
          {/* Product Variants Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-orange-500 text-white rounded-lg flex items-center justify-center text-sm">
                4
              </span>
              Product Variants (Colors & Sizes)
            </h2>
            {/* Global File Upload Trigger - Now with variant selector */}
            <div className="mb-4 p-4 bg-blue-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add images to variant:
              </label>
              <div className="flex gap-2 mb-2">
                <select
                  value={currentUploadVariantIndex}
                  onChange={(e) => setCurrentUploadVariantIndex(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:border-blue-500 bg-white"
                  disabled={form.productVariants?.length === 0}
                >
                  {form.productVariants?.map((_, index) => (
                    <option key={index} value={index}>
                      Variant {index + 1} (
                      {COLOR_OPTIONS.find((c) => c.en === form.productVariants?.[index]?.color)
                        ?.vi || "Unnamed"}
                      )
                    </option>
                  )) || <option value={0}>Add first variant to upload</option>}
                </select>
                <button
                  type="button"
                  onClick={() => {
                    if (form.productVariants?.length === 0) {
                      alert("Please add at least one variant first!");
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  className="border-2 border-dashed border-blue-300 rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50 font-medium transition-colors flex items-center gap-2"
                  disabled={form.productVariants?.length === 0}
                >
                  📁 Upload Images
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(currentUploadVariantIndex, e)}
                className="hidden"
              />
              {selectedFiles.length > 0 && (
                <p className="text-sm text-blue-600 mt-2">
                  {selectedFiles.length} file(s) selected for Variant{" "}
                  {currentUploadVariantIndex + 1}
                </p>
              )}
            </div>
            <div className="space-y-6">
              {(form.productVariants || []).map((variant: ProductVariant, vIndex: number) => (
                <div
                  key={variant._id || vIndex}
                  className="border-2 border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors"
                >
                  {/* Color Selection - unchanged */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color (English)
                      </label>
                      <select
                        value={variant.color || ""}
                        onChange={(e) => {
                          updateVariant(vIndex, "color", e.target.value);
                          const selected = COLOR_OPTIONS.find((c) => c.en === e.target.value);
                          if (selected) {
                            updateVariant(vIndex, "colorNameVi", selected.vi);
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white"
                      >
                        <option value="">-- Select Color --</option>
                        {COLOR_OPTIONS.map((color) => (
                          <option key={color.en} value={color.en}>
                            {color.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color Name (Vietnamese)
                      </label>
                      <input
                        type="text"
                        value={variant.colorNameVi || ""}
                        onChange={(e) => updateVariant(vIndex, "colorNameVi", e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        placeholder="e.g., Đen"
                      />
                    </div>
                  </div>

                  {/* Images Section - unchanged */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Product Images
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
                      {variant.images?.map((img: string, iIndex: number) => (
                        <div
                          key={iIndex}
                          className="relative group border border-gray-300 rounded-lg overflow-hidden aspect-square"
                        >
                          <img
                            src={img}
                            alt={`Variant image ${iIndex + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' text-anchor='middle' dy='.3em' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFromVariant(vIndex, iIndex)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    {/* Per-variant quick upload button (optional, for convenience) */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentUploadVariantIndex(vIndex);
                        fileInputRef.current?.click();
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Quick upload for this variant
                    </button>
                  </div>

                  {/* Sizes Section - unchanged */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Sizes & Stock
                    </label>
                    <div className="space-y-2">
                      {(variant.sizes || []).map((size: Size, sIndex: number) => (
                        <div
                          key={sIndex}
                          className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                        >
                          <div className="flex-1">
                            <select
                              value={size.size}
                              onChange={(e) =>
                                updateVariantSize(vIndex, sIndex, "size", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                            >
                              {SIZE_OPTIONS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              value={size.quantity}
                              onChange={(e) =>
                                updateVariantSize(
                                  vIndex,
                                  sIndex,
                                  "quantity",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-full border border-gray-300 rounded-lg px-3 py-2"
                              placeholder="Quantity"
                              min={0}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariantSize(vIndex, sIndex)}
                            className="text-red-600 hover:text-red-800 font-bold px-3"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addVariantSize(vIndex)}
                        className="w-full border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-orange-400 hover:text-orange-600 transition-colors"
                      >
                        + Add Size
                      </button>
                    </div>
                  </div>

                  {/* Variant Active Toggle - unchanged */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-3">
                      <input
                        id={`variant-active-${vIndex}`}
                        type="checkbox"
                        checked={!!variant.is_active}
                        onChange={(e) => updateVariant(vIndex, "is_active", e.target.checked)}
                        className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-200"
                      />
                      <label
                        htmlFor={`variant-active-${vIndex}`}
                        className="text-sm font-medium text-gray-700"
                      >
                        Variant is Active
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariant(vIndex)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      × Remove Variant
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addVariant}
                className="w-full border-2 border-dashed border-orange-300 rounded-xl px-4 py-4 text-orange-600 hover:bg-orange-50 font-medium transition-colors"
              >
                + Add New Variant
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-8 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? "Saving..." : id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
