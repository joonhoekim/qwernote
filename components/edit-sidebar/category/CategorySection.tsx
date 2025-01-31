"use client";

import { CategorySelector } from "./CategorySelector";
import { AddCategoryButton } from "./AddCategoryButton";

export function CategorySection() {
  return (
    <div className="space-y-4">
      <AddCategoryButton />
      <CategorySelector />
    </div>
  );
}