"use client";

import React, { useState } from "react";
import { Tree } from "react-arborist";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

const initialData = [
  {
    id: "1",
    name: "Getting Started",
    children: [
      {
        id: "1-1",
        name: "Installation Guide"
      },
      {
        id: "1-2",
        name: "Basic Concepts",
        children: [
          {
            id: "1-2-1",
            name: "Core Features"
          }
        ]
      }
    ]
  },
  {
    id: "2",
    name: "Advanced Topics",
    children: [
      {
        id: "2-1",
        name: "Performance Optimization"
      },
      {
        id: "2-2",
        name: "Security Best Practices"
      }
    ]
  }
];

const Node = ({ node, style, dragHandle }) => {
  const indent = node.level * 24;

  return (
    <div
      ref={dragHandle}
      style={{
        ...style,
        paddingLeft: indent
      }}
      className={cn(
        "flex items-center h-8 hover:bg-gray-100 cursor-pointer",
        node.isSelected && "bg-blue-100"
      )}
    >
      <ContextMenu>
        <ContextMenuTrigger className="flex-1">
          <span>{node.data.name}</span>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={() => console.log("Add sibling up to:", node.data.id)}>
            Add Sibling(up)
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => console.log("Add sibling down to:", node.data.id)}>
            Add Sibling(down)
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => console.log("Add child to:", node.data.id)}>
            Add Child
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => console.log("Rename:", node.data.id)}>
            Rename
          </ContextMenuItem>
          <ContextMenuItem onSelect={() => console.log("Duplicate:", node.data.id)}>
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem
            className="text-red-600"
            onSelect={() => console.log("Delete:", node.data.id)}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
};

export const CategoryTree = () => {
  const [data, setData] = useState(initialData);

  return (
    <div className="w-full max-w-md border rounded-lg">
      <Tree
        data={data}
        // width={400}
        height={200}
        indent={24}
        rowHeight={32}
        onMove={({ dragIds, parentId, index }) => {
          console.log("Move:", { dragIds, parentId, index });
        }}
      >
        {Node}
      </Tree>
    </div>
  );
};