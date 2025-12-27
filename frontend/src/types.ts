export interface SocialLink {
  name: string;
  icon: string;
  href: string;
}

export interface ContactInfo {
  label: string;
  phone: string;
}

export interface LinkItem {
  text: string;
  href: string;
}

export interface Category {
  isFeatured: boolean;
  children: Category[];
  parentId: string;
  productCount: number;
  _id: string;
  slug: string;
  parentSlug: string;
  name: string;
}
