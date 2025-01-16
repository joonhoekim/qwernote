// app/components/Editor.tsx
'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import "./styles/editor.css";

const initialConfig = {
  namespace: 'MyEditor',
  onError: (error: Error) => {
    console.error(error);
  },
};

export default function Editor() {



  return (
    <div className="editor-container">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-inner">
          <RichTextPlugin
            // 에디터 높이 조절을 위해서 ContentEditable 클래스 추가
            // node_modules/@lexical/react/LexicalContentEditable.js 를 확인
            contentEditable={<ContentEditable className="w-full h-full" />}
            placeholder={<div className="editor-placeholder">내용을 입력하세요...</div>}
            ErrorBoundary={LexicalErrorBoundary} />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}