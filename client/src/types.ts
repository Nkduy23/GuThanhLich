export interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
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

export interface LinkItem {
  text: string;
  href: string;
}
