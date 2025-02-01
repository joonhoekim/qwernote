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
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {SelectionAlwaysOnDisplay} from '@lexical/react/LexicalSelectionAlwaysOnDisplay';
import {TabIndentationPlugin} from '@lexical/react/LexicalTabIndentationPlugin';
import {TablePlugin} from '@lexical/react/LexicalTablePlugin';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';

const theme = {
    paragraph: 'my-2',
    ltr: 'ltr',
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
};

const initialConfig = {
    namespace: 'qwernote',
    theme,
    // 에러 발생시 콘솔에 출력. 프로덕션이면 에러사항 수집해서 대응.
    onError: (error: Error) => console.error(error),
};

export function Editor() {
    return (
        <div className="h-full w-full max-w-4xl">
            {/* LexicalComposer 안에 선언하는 식으로 사용한다. */}
            <LexicalComposer initialConfig={initialConfig}>
                <div className="h-full">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="prose prose-sm h-full max-w-none overflow-y-auto" />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    {/* 작업 히스토리 기능 지원  */}
                    <HistoryPlugin />
                    {/*<DragDropPaste />*/}
                    <AutoFocusPlugin />
                    <SelectionAlwaysOnDisplay />
                    <ClearEditorPlugin />
                    {/*<ComponentPickerPlugin />*/}
                    {/*<EmojiPickerPlugin />*/}
                    {/*<AutoEmbedPlugin />*/}
                    {/*<MentionsPlugin />*/}
                    {/*<EmojisPlugin />*/}
                    {/*<HashtagPlugin />*/}
                    {/*<KeywordsPlugin />*/}
                    {/*<SpeechToTextPlugin />*/}
                    {/*<AutoLinkPlugin />*/}
                    {/*<RichTextPlugin*/}
                    {/*  contentEditable={*/}
                    {/*    <div className="editor-scroller">*/}
                    {/*      <div className="editor" ref={onRef}>*/}
                    {/*        <ContentEditable placeholder={placeholder} />*/}
                    {/*      </div>*/}
                    {/*    </div>*/}
                    {/*  }*/}
                    {/*  ErrorBoundary={LexicalErrorBoundary}*/}
                    {/*/>*/}
                    {/*<MarkdownShortcutPlugin />*/}
                    {/*<CodeHighlightPlugin />*/}
                    {/*<ListPlugin />*/}
                    {/*<CheckListPlugin />*/}
                    {/*<TablePlugin*/}
                    {/*  hasCellMerge={tableCellMerge}*/}
                    {/*  hasCellBackgroundColor={tableCellBackgroundColor}*/}
                    {/*  hasHorizontalScroll={tableHorizontalScroll}*/}
                    {/*/>*/}
                    {/*<TableCellResizer />*/}
                    {/*<ImagesPlugin />*/}
                    {/*<InlineImagePlugin />*/}
                    {/*<LinkPlugin hasLinkAttributes={hasLinkAttributes} />*/}
                    {/*<PollPlugin />*/}
                    {/*<TwitterPlugin />*/}
                    {/*<YouTubePlugin />*/}
                    {/*<FigmaPlugin />*/}
                    {/*<ClickableLinkPlugin disabled={isEditable} />*/}
                    <HorizontalRulePlugin />
                    {/*<EquationsPlugin />*/}
                    {/*<ExcalidrawPlugin />*/}
                    {/*<TabFocusPlugin />*/}
                    <TabIndentationPlugin maxIndent={7} />
                    {/*<CollapsiblePlugin />*/}
                    {/*<PageBreakPlugin />*/}
                    {/*<LayoutPlugin />*/}
                    <PlainTextPlugin
                        contentEditable={<ContentEditable />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    {/*{isAutocomplete && <AutocompletePlugin />}*/}
                    {/*<div>{showTableOfContents && <TableOfContentsPlugin />}</div>*/}
                    {/*{shouldUseLexicalContextMenu && <ContextMenuPlugin />}*/}
                    {/*{shouldAllowHighlightingWithBrackets && <SpecialTextPlugin />}*/}
                    {/*<ActionsPlugin*/}
                    {/*  isRichText={isRichText}*/}
                    {/*  shouldPreserveNewLinesInMarkdown={shouldPreserveNewLinesInMarkdown}*/}
                    {/*/>*/}
                    {/*<TreeViewPlugin />*/}
                </div>
            </LexicalComposer>
        </div>
    );
}
