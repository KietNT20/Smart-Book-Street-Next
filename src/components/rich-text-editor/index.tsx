import { cn } from '@/lib/utils';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect } from 'react';
import RichTextToolbar from './richtext-toolbar';
import { customStyles } from './styles';

interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
  isPending?: boolean;
}

const RichTextEditor = ({
  content,
  onChange,
  className,
  placeholder = 'Nhập nội dung',
  readOnly = false,
  isPending,
}: RichTextEditorProps) => {
  const onUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
    [onChange]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Underline,
      Document,
      Paragraph,
      Text,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: 'bullet-list',
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: 'ordered-list',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate,
    editorProps: {
      attributes: {
        class: cn(
          'prose max-w-none focus:outline-none',
          'min-h-[300px] rounded-md border border-input p-3',
          'break-words overflow-wrap-anywhere overflow-x-hidden'
        ),
      },
    },
    editable: !readOnly,
  });

  // Update content when editor changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) {
    return null;
  }

  if (readOnly) {
    return <EditorContent editor={editor} className={className} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <style>{customStyles}</style>

      <RichTextToolbar editor={editor} />

      <EditorContent
        editor={editor}
        className={cn('prose max-w-none overflow-hidden', 'max-w-full')}
        disabled={isPending}
      />
    </div>
  );
};

export default RichTextEditor;
