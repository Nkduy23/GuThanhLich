import type { Category } from "../types";

export function buildCategoryTree(categories: Category[]): Category[] {
  const blacklist = ["khuyen-mai", "new", "gu"];

  // B1: loại bỏ toàn bộ cha blacklist và con cháu của nó
  const isDescendantOf = (cat: Category, all: Category[]): boolean => {
    if (!cat.parentSlug) return false;
    if (blacklist.includes(cat.parentSlug)) return true;
    const parent = all.find((c) => c.slug === cat.parentSlug);
    return parent ? isDescendantOf(parent, all) : false;
  };

  const filtered = categories.filter(
    (c) => !blacklist.includes(c.slug) && !isDescendantOf(c, categories)
  );

  // B2: build tree từ filtered
  const map: Record<string, Category> = {};
  filtered.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  const tree: Category[] = [];
  filtered.forEach((cat) => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat._id]);
    } else {
      tree.push(map[cat._id]);
    }
  });

  return tree;
}
