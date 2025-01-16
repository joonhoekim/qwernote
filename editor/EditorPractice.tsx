import {
  InitialConfigType,
  InitialEditorStateType,
  LexicalComposer,
} from '@lexical/react/LexicalComposer';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import theme from 'tailwindcss/defaultTheme';
import {
  EditorThemeClasses, HTMLConfig,
  Klass,
  LexicalEditor,
  LexicalNode,
  LexicalNodeReplacement,
} from 'lexical';

export default function EditorPractice() {

  const theme = {
    ltr: "ltr",
    rtl: "rtl",
  }

  const initialConfig = {
    namespace: 'EditorPractice',
    onError: (error: Error) => {
      console.error("error!",error)
      throw error;
    },
    theme: theme
  };

  return (
    <div>
      <LexicalComposer initialConfig={initialConfig} errorBoundary={LexicalErrorBoundary}>


      </LexicalComposer>
    </div>
  )
}