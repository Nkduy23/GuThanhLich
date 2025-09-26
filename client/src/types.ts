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
  description: string;
  categoryId: string | CategoryRef;
  brandId: { $oid: string };
}

export interface Category {
  _id: { $oid: string };
  name: string;
  slug: string;
  type: string;
  image: string;
  description: string;
  parentId: { $oid: string } | null;
  parentSlug: string;
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
