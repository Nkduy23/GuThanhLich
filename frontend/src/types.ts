export interface CategoryRef {
  _id: string;
  slug: string;
  name: string;
}

export interface BrandRef {
  _id: string;
  name: string;
}

export interface Size {
  size: string;
  quantity: number;
}

export interface ProductVariant {
  _id?: string;
  color: string;
  colorNameVi: string;
  sizes: Size[];
  images: string[];
  is_active: boolean;
  productId?: string;
  variantName?: string;
}

export interface ProductSpec {
  _id?: string;
  key: string;
  value: string;
  productId?: string;
}

export interface ProductHighlight {
  _id?: string;
  title: string;
  description: string;
  productId?: string;
}

export interface Product {
  brandSlug?: string;
  _id: string;
  name: string;
  code?: string;
  tags: string[];
  slug?: string;
  price: number;
  totalStock?: number;
  finalPrice?: number;
  image?: string;
  sale: number;
  is_new?: boolean;
  description: string;
  is_active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categoryId: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  brandId?: any;
  defaultVariantId?: string;
  productSpecs?: ProductSpec[];
  productHighlights?: ProductHighlight[];
  productVariants?: ProductVariant[];
}

export type ProductIds = Pick<Product, "_id" | "productVariants" | "name"> & { images: string[] };

export interface ProductPopulated extends Product {
  categorySlug: string;
  categoryId: CategoryRef;
  brandId: BrandRef;
}

export interface Variant {
  _id: string;
  productId: string;
  color: string;
  variantName: string;
  sizes: {
    _id: string;
    size: string;
    quantity: number;
  }[];
  availableSizes: string[];
  availableColors: { color: string; variantId: string }[];
  images: string[];
}

export interface Spec {
  _id: string;
  productId: string;
  key: string;
  value: string;
}

export interface Highlight {
  _id: string;
  productId: string;
  title: string;
  description: string;
}

export interface Review {
  _id: string;
  user: string;
  rate: number;
  comment: string;
}

export interface Category {
  _id: string;
  name: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  parentId?: string | null;
  parentSlug?: string | null;
  isFeatured: boolean;
  order: number;
  productCount: number;
  children: Category[];
  products?: Product[];
}

export interface Cart_Item {
  _id: string;
  productId: string;
  variantId: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  availableColors: { color: string; variantId: string }[];
  availableSizes: string[];
  price: number;
  id?: string;
}

export type LocalSummary = Pick<
  Cart_Item,
  "productId" | "quantity" | "size" | "unit_price" | "variantId" | "price"
> & {
  size?: string;
};

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface User_Address {
  _id: string;
  address: string;
  city: string;
  country: string;
}

export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface ContactInfo {
  label: string;
  phone: string;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  slug: string;
}

export interface LinkItem {
  text: string;
  href: string;
}
