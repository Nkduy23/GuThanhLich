import type { Category } from "../types";

export function buildCategoryTree(categories: Category[]): Category[] {
  const map: Record<string, Category> = {};

  // Gán mặc định children = [] cho tất cả
  categories.forEach((cat) => {
    map[cat._id] = { ...cat, children: [] };
  });

  const tree: Category[] = [];

  categories.forEach((cat) => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat._id]);
    } else {
      tree.push(map[cat._id]);
    }
  });

  return tree;
}
