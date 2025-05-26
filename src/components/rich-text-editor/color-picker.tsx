'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Editor } from '@tiptap/react';
import { Palette } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { COLOR_PRESETS } from './styles';

const ColorPicker = ({ editor }: { editor: Editor }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
  const [tempColor, setTempColor] = useState('#09090b');
  const currentColor = editor.getAttributes('textStyle').color as string | null;

  const handlePresetClick = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setIsPopoverOpen(false);
  };

  const handleCustomColorOpen = () => {
    setTempColor(currentColor || '#09090b');
    setIsColorDialogOpen(true);
    setIsPopoverOpen(false);
  };

  const handleCustomColorApply = () => {
    editor.chain().focus().setColor(tempColor).run();
    setIsColorDialogOpen(false);
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className={editor.isActive('textStyle') ? 'bg-muted' : ''}
            type='button'
            title='Màu chữ'
          >
            <Palette className='size-4' />
            {currentColor && (
              <div
                className='ml-1 h-2 w-2 rounded-full border border-zinc-300'
                style={{ backgroundColor: currentColor }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-52 p-2' align='start'>
          <div className='grid grid-cols-5 gap-1'>
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                className='h-6 w-6 rounded-sm border border-zinc-300 transition-colors hover:border-zinc-400'
                style={{ backgroundColor: color }}
                onClick={() => handlePresetClick(color)}
                title={color}
              />
            ))}
          </div>
          <Button
            variant='outline'
            size='sm'
            className='mt-3 w-full'
            onClick={handleCustomColorOpen}
          >
            Màu tùy chỉnh
          </Button>
          {currentColor && (
            <Button
              variant='ghost'
              size='sm'
              className='mt-2 w-full'
              onClick={() => {
                editor.chain().focus().unsetColor().run();
                setIsPopoverOpen(false);
              }}
            >
              Xóa màu
            </Button>
          )}
        </PopoverContent>
      </Popover>

      <Dialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chọn màu tùy chỉnh</DialogTitle>
          </DialogHeader>
          <div className='space-y-4'>
            <input
              type='color'
              className='h-12 w-full cursor-pointer rounded'
              value={tempColor}
              onChange={(e) => setTempColor(e.target.value)}
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='outline'
                onClick={() => setIsColorDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button onClick={handleCustomColorApply}>Áp dụng</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ColorPicker;
