// components/editor/Editor.tsx
"use client";

import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const theme = {
  // Theme styling goes here
  //...
};

function onError(error) {
  console.error(error);
}

export function Editor() {
  const initialConfig = {
    namespace: "qwernote",
    theme,
    onError,
  };

  return (
    <div className="relative flex flex-col h-full w-full">
      {" "}
      {/* flex container */}
      <LexicalComposer initialConfig={initialConfig}>
        <div className="flex-1 min-h-0">
          {" "}
          {/* flex-1과 min-h-0으로 컨테이너 크기에 맞춤 */}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-full w-full p-4 outline-none focus:outline-none overflow-auto" />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted-foreground select-none pointer-events-none">
                Enter some text...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
