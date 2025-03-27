import { Editor } from '@tiptap/react';

export interface RichTextEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}

export interface RichTextToolbarProps {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
  onAddTable: () => void;
}

export interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string) => void;
  initialUrl?: string;
}
