export interface CategoryRef {
  _id: string;
  slug: string;
  name: string;
}

export interface ProductVariant {
  _id: string;
  color: string;
  colorNameVi: string;
  images: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  sale: number;
  is_new: boolean;
  description: string;
  is_active: boolean;
  defaultVariantId?: ProductVariant;
}

export interface ProductPopulated extends Product {
  tags: string;
  categorySlug: string;
  categoryId: CategoryRef;
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
  children: Category[];
  products: Product[];
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
