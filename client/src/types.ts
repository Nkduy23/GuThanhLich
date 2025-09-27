export interface CategoryRef {
  _id: string;
  slug: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sale: number;
  description: string;
  brandId: { $oid: string };
  is_active: boolean;
}

export interface ProductPopulated extends Product {
  categoryId: CategoryRef;
}

export interface Variant {
  _id: string;
  productId: string;
  color: string;
  sizes: { size: string; quantity: number }[];
}

export interface VariantImage {
  variantId: string;
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

export interface Category {
  _id: { $oid: string };
  name: string;
  title: string;
  slug: string;
  type: string;
  image: string;
  description: string;
  parentId: { $oid: string } | null;
  parentSlug: string;
  isFeatured: boolean;
  order: number;
}

export interface Review {
  _id: string;
  user: string;
  rate: number;
  comment: string;
}

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

export interface Cart_Item {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ContactInfo {
  label: string;
  phone: string;
}

export interface LinkItem {
  text: string;
  href: string;
}
