// app/components/Editor.tsx
'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import '../styles/editor.css';
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

const initialConfig = {
  namespace: 'MyEditor',
  onError: (error: Error) => {
    console.error(error);
  },
  nodes: [],
};

export default function Editor() {
  return (
    <div className="editor-shell">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable />}
            placeholder={<div className="editor-placeholder">내용을 입력하세요...</div>}
            ErrorBoundary={LexicalErrorBoundary}          />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}