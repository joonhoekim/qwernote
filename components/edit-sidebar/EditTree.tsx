"use client";

import { Tree } from "react-arborist";
import { editTempData } from "@/components/edit-sidebar/temp/edit-temp-data";

export default function EditTree() {
  return <Tree initialData={editTempData} />;
}
