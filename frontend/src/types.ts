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

export interface LinkItem {
  text: string;
  href: string;
}
