import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

const theme = {
  paragraph: "my-2",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

const initialConfig = {
  namespace: "MyEditor",
  theme,
  onError: (error) => console.error(error),
};

export function Editor() {
  return (
    <div className="w-full max-w-4xl">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="editor-container h-full">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="h-full overflow-y-auto prose prose-sm max-w-none" />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
