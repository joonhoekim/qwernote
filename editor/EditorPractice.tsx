import {
    InitialConfigType,
    InitialEditorStateType,
    LexicalComposer,
} from '@lexical/react/LexicalComposer';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {
    EditorThemeClasses,
    HTMLConfig,
    Klass,
    LexicalEditor,
    LexicalNode,
    LexicalNodeReplacement,
} from 'lexical';
import theme from 'tailwindcss/defaultTheme';

export default function EditorPractice() {
    const theme = {
        ltr: 'ltr',
        rtl: 'rtl',
    };

    const initialConfig = {
        namespace: 'EditorPractice',
        onError: (error: Error) => {
            console.error('error!', error);
            throw error;
        },
        theme: theme,
    };

    return (
        <div>
            <LexicalComposer
                initialConfig={initialConfig}
                errorBoundary={LexicalErrorBoundary}></LexicalComposer>
        </div>
    );
}
