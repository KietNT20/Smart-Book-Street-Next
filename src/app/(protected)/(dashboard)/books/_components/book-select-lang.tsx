'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Language, LanguageLabels } from '@/enums/lang';
import { cn } from '@/lib/utils';
import React from 'react';

interface BookSelectLangProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const BookSelectLang: React.FC<BookSelectLangProps> = ({
  value,
  onValueChange,
  disabled = false,
  placeholder = 'Chọn ngôn ngữ',
  className,
}) => {
  return (
    <Select
      disabled={disabled}
      value={value || Language.VIETNAMESE}
      onValueChange={onValueChange}
    >
      <SelectTrigger
        className={cn('w-full', !value && 'text-muted-foreground', className)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(Language).map(([key, langValue]) => (
          <SelectItem key={key} value={langValue}>
            {LanguageLabels[langValue as Language]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BookSelectLang;
