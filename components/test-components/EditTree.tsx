"use client";

import { Tree } from "react-arborist";
import { editTempData } from "@/components/test-components/test-data/edit-temp-data";

export default function EditTree() {
  return <Tree initialData={editTempData} />;
}
