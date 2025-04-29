'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Language, VietnameseLanguageLabels } from '@/enums/lang';
import { useGetCategories } from '@/hooks/use-category';
import useDebounce from '@/hooks/use-debounce';
import { BookSearchCriteria } from '@/types/book-types';
import { Check, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  filters: BookSearchCriteria;
  setFilters: (filters: BookSearchCriteria) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
};

const PRICE_RANGES = [
  { label: 'Tất cả giá', minPrice: undefined, maxPrice: undefined },
  { label: 'Dưới 100.000₫', minPrice: 0, maxPrice: 100000 },
  { label: '100.000₫ - 200.000₫', minPrice: 100000, maxPrice: 200000 },
  { label: '200.000₫ - 300.000₫', minPrice: 200000, maxPrice: 300000 },
  { label: '300.000₫ - 500.000₫', minPrice: 300000, maxPrice: 500000 },
  { label: '500.000₫ - 1.000.000₫', minPrice: 500000, maxPrice: 1000000 },
  { label: 'Trên 1.000.000₫', minPrice: 1000000, maxPrice: undefined },
];

const BookSearchFilter = ({
  filters,
  setFilters,
  isSearching,
  onSearch,
  onClearSearch,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const debouncedFilters = useDebounce(filters, 700);

  const { categoriesData, isLoading: isCategoriesLoading } = useGetCategories();

  // Initialize price range index when filters change
  useEffect(() => {
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const matchingIndex = PRICE_RANGES.findIndex(
        (range) =>
          range.minPrice === filters.minPrice &&
          range.maxPrice === filters.maxPrice
      );
      if (matchingIndex !== -1) {
        setPriceRangeIndex(matchingIndex);
      }
    } else {
      setPriceRangeIndex(0);
    }
  }, [filters.minPrice, filters.maxPrice]);

  // Trigger search on debounced filter changes
  useEffect(() => {
    onSearch();
  }, [debouncedFilters, onSearch]);

  const handleInputChange = (
    field: keyof BookSearchCriteria,
    value: unknown
  ) => {
    setFilters({ ...filters, [field]: value });
  };

  const handlePriceRangeChange = (value: string) => {
    const selectedIndex = parseInt(value);
    setPriceRangeIndex(selectedIndex);

    const { minPrice, maxPrice } = PRICE_RANGES[selectedIndex];
    handleInputChange('minPrice', minPrice);
    handleInputChange('maxPrice', maxPrice);
  };

  const handleLanguageToggle = (lang: string) => {
    const currentLangs = filters.languagesList || [];
    const updatedLangs = currentLangs.includes(lang)
      ? currentLangs.filter((l) => l !== lang)
      : [...currentLangs, lang];

    handleInputChange(
      'languagesList',
      updatedLangs.length > 0 ? updatedLangs : undefined
    );
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = filters.categoryIds || [];
    const updatedCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id) => id !== categoryId)
      : [...currentCategories, categoryId];

    handleInputChange(
      'categoryIds',
      updatedCategories.length > 0 ? updatedCategories : undefined
    );
  };

  const clearField = (field: keyof BookSearchCriteria) => {
    if (field === 'minPrice' || field === 'maxPrice') {
      // Reset price range to "All prices"
      setPriceRangeIndex(0);
      handleInputChange('minPrice', undefined);
      handleInputChange('maxPrice', undefined);
    } else if (field === 'languagesList') {
      handleInputChange('languagesList', undefined);
    } else if (field === 'categoryIds') {
      handleInputChange('categoryIds', undefined);
    } else {
      handleInputChange(field, '');
    }
  };

  const getSelectedLanguagesLabel = () => {
    const langs = filters.languagesList || [];
    if (langs.length === 0) return 'Tất cả ngôn ngữ';
    if (langs.length === 1)
      return VietnameseLanguageLabels[langs[0] as Language];
    return `${langs.length} ngôn ngữ được chọn`;
  };

  const getSelectedCategoriesLabel = () => {
    const categories = filters.categoryIds || [];
    if (categories.length === 0) return 'Tất cả thể loại';
    if (categories.length === 1) {
      const category = categoriesData.find((c) => c.id === categories[0]);
      return category ? category.categoryName : '1 thể loại được chọn';
    }
    return `${categories.length} thể loại được chọn`;
  };

  return (
    <Card className='mb-6'>
      <CardContent className='p-3 pt-3'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className='flex items-center justify-end gap-2'>
            {isSearching && (
              <Button variant='outline' onClick={onClearSearch} size='sm'>
                Xóa bộ lọc
              </Button>
            )}
            <CollapsibleTrigger asChild>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Bộ lọc{' '}
                {isOpen ? (
                  <ChevronUp className='ml-2 h-4 w-4' />
                ) : (
                  <ChevronDown className='ml-2 h-4 w-4' />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 pt-2 md:grid-cols-12'>
              {/* Tên sách */}
              <div className='col-span-1 space-y-2 md:col-span-4'>
                <Label htmlFor='title'>Tên sách</Label>
                <div className='relative'>
                  <Input
                    id='title'
                    placeholder='Tìm theo tên sách'
                    value={filters.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  {filters.title && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('title')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              {/* ISBN */}
              <div className='col-span-1 space-y-2 md:col-span-4'>
                <Label htmlFor='isbn'>ISBN</Label>
                <div className='relative'>
                  <Input
                    id='isbn'
                    placeholder='Tìm theo ISBN'
                    value={filters.isbn || ''}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                  />
                  {filters.isbn && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full'
                      onClick={() => clearField('isbn')}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  )}
                </div>
              </div>

              {/* Khoảng giá */}
              <div className='col-span-1 space-y-2 md:col-span-4'>
                <Label htmlFor='priceRange'>Khoảng giá</Label>
                <div className='relative'>
                  <Select
                    value={priceRangeIndex.toString()}
                    onValueChange={handlePriceRangeChange}
                  >
                    <SelectTrigger id='priceRange'>
                      <SelectValue placeholder='Chọn khoảng giá' />
                    </SelectTrigger>
                    <SelectContent>
                      {PRICE_RANGES.map((range, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(filters.minPrice !== undefined ||
                    filters.maxPrice !== undefined) &&
                    priceRangeIndex !== 0 && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full'
                        onClick={() => {
                          setPriceRangeIndex(0);
                          clearField('minPrice');
                        }}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                </div>
              </div>

              {/* Ngôn ngữ - Accordion Checkbox */}
              <Accordion
                type='single'
                collapsible
                className='col-span-1 w-full md:col-span-6'
              >
                <AccordionItem value='languages'>
                  <AccordionTrigger>
                    <div className='flex w-full justify-between'>
                      <span>Ngôn ngữ</span>
                      <span className='pr-4 text-sm text-muted-foreground'>
                        {getSelectedLanguagesLabel()}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className='h-60 pr-4'>
                      <div className='space-y-2'>
                        {Object.values(Language).map((lang) => (
                          <div
                            key={lang}
                            className='flex items-center space-x-2'
                          >
                            <Checkbox
                              id={`lang-${lang}`}
                              checked={(filters.languagesList || []).includes(
                                lang
                              )}
                              onCheckedChange={() => handleLanguageToggle(lang)}
                            />
                            <Label
                              htmlFor={`lang-${lang}`}
                              className='flex-grow cursor-pointer'
                            >
                              {VietnameseLanguageLabels[lang]}
                            </Label>
                            {(filters.languagesList || []).includes(lang) && (
                              <Check className='h-4 w-4 text-primary' />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Thể loại - Accordion Checkbox */}
              <Accordion
                type='single'
                collapsible
                className='col-span-1 w-full md:col-span-6'
              >
                <AccordionItem value='categories'>
                  <AccordionTrigger>
                    <div className='flex w-full justify-between'>
                      <span>Thể loại</span>
                      <span className='pr-4 text-sm text-muted-foreground'>
                        {getSelectedCategoriesLabel()}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className='h-60 pr-4'>
                      <div className='space-y-2'>
                        {!isCategoriesLoading &&
                          categoriesData.map((category) => (
                            <div
                              key={category.id}
                              className='flex items-center space-x-2'
                            >
                              <Checkbox
                                id={`cat-${category.id}`}
                                checked={(filters.categoryIds || []).includes(
                                  category.id
                                )}
                                onCheckedChange={() =>
                                  handleCategoryToggle(category.id)
                                }
                              />
                              <Label
                                htmlFor={`cat-${category.id}`}
                                className='flex-grow cursor-pointer'
                                title={category.description}
                              >
                                {category.categoryName}
                              </Label>
                              {(filters.categoryIds || []).includes(
                                category.id
                              ) && <Check className='h-4 w-4 text-primary' />}
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default BookSearchFilter;
