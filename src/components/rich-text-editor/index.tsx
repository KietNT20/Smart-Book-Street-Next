import { cn } from '@/lib/utils';
import BulletList from '@tiptap/extension-bullet-list';
import Color from '@tiptap/extension-color';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useState } from 'react';
import LinkModal from './link-modal';
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
  placeholder = 'Nhập nội dung...',
  readOnly = false,
  isPending,
}: RichTextEditorProps) => {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');

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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
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

  const addLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href || '';
    setCurrentLinkUrl(previousUrl);
    setLinkModalOpen(true);
  }, [editor]);

  const handleLinkSubmit = useCallback(
    (url: string) => {
      if (!editor) return;

      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      if (url && !/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  if (readOnly) {
    return <EditorContent editor={editor} className={className} />;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <style>{customStyles}</style>

      <RichTextToolbar editor={editor} onAddLink={addLink} />

      <EditorContent
        editor={editor}
        className={cn('prose max-w-none overflow-hidden', 'max-w-full')}
        disabled={isPending}
      />

      <LinkModal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onSubmit={handleLinkSubmit}
        initialUrl={currentLinkUrl}
      />
    </div>
  );
};

export default RichTextEditor;
