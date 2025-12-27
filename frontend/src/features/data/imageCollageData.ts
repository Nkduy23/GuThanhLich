// src/data/imageCollageData.ts
export interface CollageImage {
  src: string;
  href: string;
}

export const imageCollages: CollageImage[][] = [
  [
    { src: "/images/gallery/1.webp", href: "/category/ao" },
    { src: "/images/gallery/2.webp", href: "/category/ao" },
    { src: "/images/gallery/3.webp", href: "/category/ao" },
    { src: "/images/gallery/4.webp", href: "/category/ao" },
    { src: "/images/gallery/5.webp", href: "/category/ao" },
    { src: "/images/gallery/6.webp", href: "/category/ao" },
  ],
  [
    { src: "/images/gallery/7.webp", href: "/category/quan" },
    { src: "/images/gallery/8.webp", href: "/category/quan" },
    { src: "/images/gallery/9.webp", href: "/category/quan" },
    { src: "/images/gallery/10.webp", href: "/category/quan" },
    { src: "/images/gallery/11.webp", href: "/category/quan" },
    { src: "/images/gallery/12.webp", href: "/category/quan" },
  ],
];
