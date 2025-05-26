import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Editor } from '@tiptap/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from 'lucide-react';
import ColorPicker from './color-picker';

interface RichTextToolbarProps {
  editor: Editor;
}

const RichTextToolbar = ({ editor }: RichTextToolbarProps) => {
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
                level: parseInt(value.charAt(1)) as 1 | 2 | 3 | 4 | 5 | 6,
              })
              .run();
          }
        }}
      >
        <SelectTrigger className='h-8 w-36'>
          <SelectValue placeholder='Kiểu đoạn' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='paragraph'>
            <p className='flex items-center gap-2'>
              <span className='size-4'>P</span> Đoạn văn
            </p>
          </SelectItem>
          <SelectItem value='h1'>
            <p className='flex items-center gap-2'>
              <Heading1 className='size-4' /> Tiêu đề 1
            </p>
          </SelectItem>
          <SelectItem value='h2'>
            <p className='flex items-center gap-2'>
              <Heading2 className='size-4' /> Tiêu đề 2
            </p>
          </SelectItem>
          <SelectItem value='h3'>
            <p className='flex items-center gap-2'>
              <Heading3 className='size-4' /> Tiêu đề 3
            </p>
          </SelectItem>
          <SelectItem value='h4'>
            <p className='flex items-center gap-2'>
              <Heading4 className='size-4' /> Tiêu đề 4
            </p>
          </SelectItem>
          <SelectItem value='h5'>
            <p className='flex items-center gap-2'>
              <Heading5 className='size-4' /> Tiêu đề 5
            </p>
          </SelectItem>
          <SelectItem value='h6'>
            <p className='flex items-center gap-2'>
              <Heading6 className='size-4' /> Tiêu đề 6
            </p>
          </SelectItem>
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
        <Bold className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-muted' : ''}
        type='button'
        title='Nghiêng'
      >
        <Italic className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-muted' : ''}
        type='button'
        title='Gạch chân'
      >
        <UnderlineIcon className='size-4' />
      </Button>

      {/* Chọn màu chữ */}
      <ColorPicker editor={editor} />

      {/* Danh sách */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-muted' : ''}
        type='button'
        title='Danh sách không đánh số'
      >
        <List className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-muted' : ''}
        type='button'
        title='Danh sách đánh số'
      >
        <ListOrdered className='size-4' />
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
        <AlignLeft className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
        type='button'
        title='Canh giữa'
      >
        <AlignCenter className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
        type='button'
        title='Canh phải'
      >
        <AlignRight className='size-4' />
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
        <Undo className='size-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        type='button'
        title='Làm lại'
      >
        <Redo className='size-4' />
      </Button>
    </div>
  );
};

export default RichTextToolbar;
