// components/rich-text-editor/toolbar.tsx
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Redo,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo
} from 'lucide-react';

interface RichTextToolbarProps {
  editor: Editor;
  onAddLink: () => void;
  onAddImage: () => void;
  onAddTable: () => void;
}

const RichTextToolbar = ({
  editor,
  onAddLink,
  onAddImage,
  onAddTable
}: RichTextToolbarProps) => {
  return (
    <div className='flex flex-wrap gap-1 rounded-md border border-input bg-background p-1'>
      {/* Dropdown chọn heading */}
      <Select
        value={(() => {
          if (editor.isActive('heading', { level: 1 })) return 'h1';
          if (editor.isActive('heading', { level: 2 })) return 'h2';
          if (editor.isActive('heading', { level: 3 })) return 'h3';
          if (editor.isActive('heading', { level: 4 })) return 'h4';
          if (editor.isActive('heading', { level: 5 })) return 'h5';
          if (editor.isActive('heading', { level: 6 })) return 'h6';
          return 'paragraph';
        })()}
        onValueChange={(value) => {
          if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
          } else {
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: parseInt(value.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6
              })
              .run();
          }
        }}
      >
        <SelectTrigger className='h-8 w-[120px]'>
          <SelectValue placeholder='Kiểu đoạn' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='paragraph'>Đoạn văn</SelectItem>
          <SelectItem value='h1'>Tiêu đề 1</SelectItem>
          <SelectItem value='h2'>Tiêu đề 2</SelectItem>
          <SelectItem value='h3'>Tiêu đề 3</SelectItem>
          <SelectItem value='h4'>Tiêu đề 4</SelectItem>
          <SelectItem value='h5'>Tiêu đề 5</SelectItem>
          <SelectItem value='h6'>Tiêu đề 6</SelectItem>
        </SelectContent>
      </Select>

      {/* Các nút định dạng cơ bản */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-muted' : ''}
        type='button'
        title='Đậm'
      >
        <Bold className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
        type='button'
        title='Nghiêng'
      >
        <Italic className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-muted' : ''}
        type='button'
        title='Gạch chân'
      >
        <UnderlineIcon className='h-4 w-4' />
      </Button>

      {/* Danh sách */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        type='button'
        title='Danh sách không đánh số'
      >
        <List className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        type='button'
        title='Danh sách đánh số'
      >
        <ListOrdered className='h-4 w-4' />
      </Button>

      {/* Liên kết, hình ảnh, bảng */}
      <Button
        variant='ghost'
        size='sm'
        onClick={onAddLink}
        className={editor.isActive('link') ? 'bg-muted' : ''}
        type='button'
        title='Thêm liên kết'
      >
        <LinkIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={onAddImage}
        type='button'
        title='Thêm hình ảnh'
      >
        <ImageIcon className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={onAddTable}
        type='button'
        title='Thêm bảng'
      >
        <TableIcon className='h-4 w-4' />
      </Button>

      {/* Căn chỉnh văn bản */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
        type='button'
        title='Canh trái'
      >
        <AlignLeft className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
        type='button'
        title='Canh giữa'
      >
        <AlignCenter className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
        type='button'
        title='Canh phải'
      >
        <AlignRight className='h-4 w-4' />
      </Button>

      {/* Hoàn tác/làm lại */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        type='button'
        title='Hoàn tác'
      >
        <Undo className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        type='button'
        title='Làm lại'
      >
        <Redo className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default RichTextToolbar;
