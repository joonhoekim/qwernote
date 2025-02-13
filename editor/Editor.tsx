import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {CharacterLimitPlugin} from '@lexical/react/LexicalCharacterLimitPlugin';
import {CheckListPlugin} from '@lexical/react/LexicalCheckListPlugin';
import {ClearEditorPlugin} from '@lexical/react/LexicalClearEditorPlugin';
import {ClickableLinkPlugin} from '@lexical/react/LexicalClickableLinkPlugin';
import {CollaborationPlugin} from '@lexical/react/LexicalCollaborationPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HashtagPlugin} from '@lexical/react/LexicalHashtagPlugin';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {HorizontalRulePlugin} from '@lexical/react/LexicalHorizontalRulePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {SelectionAlwaysOnDisplay} from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    EditorState,
} from 'lexical';
import {debounce} from 'lodash';
import {useCallback} from 'react';

interface EditorProps {
    initialContent?: string;
    onChange?: (content: string) => void;
}

const theme = {
    paragraph: 'my-2',
    ltr: 'ltr',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
};

export function Editor({initialContent = '', onChange}: EditorProps) {
    const initialConfig = {
        namespace: 'qwernote',
        theme,
        onError: (error: Error) => console.error(error),
        editorState: () => {
            const root = $getRoot();
            if (root.getTextContent() === '') {
                const paragraph = $createParagraphNode();
                if (initialContent) {
                    paragraph.append($createTextNode(initialContent));
                }
                root.append(paragraph);
            }
        },
    };

    const handleChange = (editorState: EditorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const content = root.getTextContent();
            onChange?.(content);
        });
    };

    // 디바운스된 변경 핸들러
    const debouncedHandleChange = useCallback(
        debounce((editorState: EditorState) => {
            handleChange(editorState);
        }, 500),
        [onChange],
    );

    return (
        <div className="h-full w-full max-w-4xl">
            <LexicalComposer initialConfig={initialConfig}>
                <div className="h-full">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="prose prose-sm h-full max-w-none overflow-y-auto p-4" />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <SelectionAlwaysOnDisplay />
                    <ClearEditorPlugin />
                    <OnChangePlugin onChange={debouncedHandleChange} />
                    <HorizontalRulePlugin />
                    <TabIndentationPlugin maxIndent={7} />
                    <PlainTextPlugin
                        contentEditable={<ContentEditable />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
            </LexicalComposer>
        </div>
    );
}
