export interface Size {
  _id?: string;
  size: string;
  quantity: number;
}

export interface ProductVariant {
  _id?: string;
  productId?: string;
  sizes: Size[];
  color?: string;
  colorNameVi?: string;
  images?: string[];
  is_active?: boolean;
  variantName?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
}
export interface Product {
  _id: string;
  name: string;
  code: string;
  slug: string;
  price: number;
  sale?: number;
  finalPrice: number;
  brandSlug: string;
  is_active: boolean;
  categoryId: Category;
  productVariants: ProductVariant[];
  totalStock: number;
  image: string | null;
  description?: string;
  tags?: string[];
  productSpecifications?: ProductSpecifications[];
  productHighlights?: ProductHighlights[];
  brandId?: string;
}

export interface ProductSpecifications {
  _id?: string;
  key: string;
  value: string;
  productId?: string;
}

export interface ProductHighlights {
  _id?: string;
  title: string;
  description: string;
  productId?: string;
}

export interface Brand {
  _id: string;
  name: string;
}

export interface ProductForm {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  sale: number;
  sold: number;
  description: string;
  categorySlug: string;
  brandSlug?: string;
  tags: string[];
  is_active: boolean;
  code?: string;
  totalStock?: number;
  finalPrice?: number;
  images: string[];
  is_new?: boolean;
  categoryId: string;
  brandId: string;
  defaultVariantId?: ProductVariant[];
  productVariants?: ProductVariant[];
  productSpecifications?: ProductSpecifications[];
  productHighlights?: ProductHighlights[];
}
