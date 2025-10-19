export interface Product {
  _id: string;
  name: string;
  price: number;
  sale: number;
  categorySlug: string;
  tags: string[];
  slug: string;
  defaultVariantId: {
    _id: string;
    color: string;
    colorNameVi: string;
    images: string[];
  };
  images: string[];
  is_new: boolean;
}

export interface ProductIds extends Product {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productVariants: any;
}

export interface categorySection {
  _id: string;
  name: string;
  title: string;
  description: string;
  slug: string;
  products: Product[];
}

export interface parentCategories {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  thumbnail: string;
  slug: string;
}

export interface Cart_Item {
  _id: string;
  productId: string;
  variantId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  availableColors: { color: string; variantId: string }[];
  availableSizes: string[];
}

export type LocalSummary = Pick<
  Cart_Item,
  "_id" | "productId" | "quantity" | "size" | "unit_price" | "variantId" | "price" | "color"
>;

export type BodyCartSever = {
  variantId: string;
  size: string;
  quantity: number | undefined;
};

export interface Size {
  size: string;
  quantity: number;
}

export interface ProductVariant {
  _id: string;
  color: string;
  colorNameVi: string;
  sizes: Size[];
  images: string[];
  is_active: boolean;
  productId?: string;
  variantName?: string;
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

export interface Reviews {
  _id: string;
  user: string;
  rate: number;
  comment: string;
}

export interface ProductDetail {
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
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  brandId: string;
  defaultVariantId?: ProductVariant[];
  productVariants?: ProductVariant[];
  productSpecifications?: ProductSpecifications[];
  productHighlights?: ProductHighlights[];
  reviews?: Reviews[];
}
