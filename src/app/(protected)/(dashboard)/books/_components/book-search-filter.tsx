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
import { BookSearchCriteria } from '@/types/book-types';
import { Check, Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Props = {
  onFilterChange: (filter: BookSearchCriteria) => void;
  initialFilter?: BookSearchCriteria;
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

const BookSearchFilter = ({ onFilterChange, initialFilter = {} }: Props) => {
  const [filter, setFilter] = useState<BookSearchCriteria>(initialFilter);
  const [priceRangeIndex, setPriceRangeIndex] = useState(0);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { categoriesData, isLoading: isCategoriesLoading } = useGetCategories();

  // Initialize from initialFilter
  useEffect(() => {
    if (initialFilter.languagesList) {
      // Handle both array and string cases for backward compatibility
      if (Array.isArray(initialFilter.languagesList)) {
        setSelectedLanguages(initialFilter.languagesList);
      } else {
        // If somehow it's still a string, convert to array for compatibility
        setSelectedLanguages(
          (initialFilter.languagesList as string).split(',')
        );
      }
    }

    if (initialFilter.categoryIds && initialFilter.categoryIds.length > 0) {
      setSelectedCategories([...initialFilter.categoryIds]);
    }

    // Set price range index based on initial min/max prices
    if (
      initialFilter.minPrice !== undefined ||
      initialFilter.maxPrice !== undefined
    ) {
      const matchingIndex = PRICE_RANGES.findIndex(
        (range) =>
          range.minPrice === initialFilter.minPrice &&
          range.maxPrice === initialFilter.maxPrice
      );
      if (matchingIndex !== -1) {
        setPriceRangeIndex(matchingIndex);
      }
    }
  }, [initialFilter]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFilter = { ...filter, [name]: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handlePriceRangeChange = (value: string) => {
    const selectedIndex = parseInt(value);
    setPriceRangeIndex(selectedIndex);

    const { minPrice, maxPrice } = PRICE_RANGES[selectedIndex];
    const newFilter = {
      ...filter,
      minPrice,
      maxPrice,
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages((current) => {
      const updated = current.includes(lang)
        ? current.filter((l) => l !== lang)
        : [...current, lang];

      const updatedFilter = { ...filter };
      if (updated.length > 0) {
        updatedFilter.languagesList = updated;
      } else {
        delete updatedFilter.languagesList;
      }

      setFilter(updatedFilter);
      onFilterChange(updatedFilter);
      return updated;
    });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((current) => {
      const updated = current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId];

      const updatedFilter = { ...filter };
      if (updated.length > 0) {
        updatedFilter.categoryIds = [...updated];
      } else {
        delete updatedFilter.categoryIds;
      }

      setFilter(updatedFilter);
      onFilterChange(updatedFilter);
      return updated;
    });
  };

  const handleReset = () => {
    setPriceRangeIndex(0);
    setSelectedLanguages([]);
    setSelectedCategories([]);
    const emptyFilter = {};
    setFilter(emptyFilter);
    onFilterChange(emptyFilter);
  };

  const getSelectedLanguagesLabel = () => {
    if (selectedLanguages.length === 0) return 'Tất cả ngôn ngữ';
    if (selectedLanguages.length === 1)
      return VietnameseLanguageLabels[selectedLanguages[0] as Language];
    return `${selectedLanguages.length} ngôn ngữ được chọn`;
  };

  const getSelectedCategoriesLabel = () => {
    if (selectedCategories.length === 0) return 'Tất cả thể loại';
    if (selectedCategories.length === 1) {
      const category = categoriesData.find(
        (c) => c.id === selectedCategories[0]
      );
      return category ? category.categoryName : '1 thể loại được chọn';
    }
    return `${selectedCategories.length} thể loại được chọn`;
  };

  return (
    <Card>
      <CardContent className='p-4 pt-4'>
        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <div className='my-2 flex justify-end gap-2'>
              <Button variant='outline' size='sm'>
                <Filter className='mr-2 h-4 w-4' />
                Bộ lọc {isFilterOpen ? '▲' : '▼'}
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-12'>
              {/* Tên sách */}
              <div className='col-span-4'>
                <Label htmlFor='title'>Tên sách</Label>
                <Input
                  id='title'
                  name='title'
                  value={filter.title || ''}
                  onChange={handleInputChange}
                  placeholder='Tìm kiếm tên sách'
                />
              </div>

              <div className='col-span-4'>
                <Label htmlFor='isbn'>ISBN</Label>
                <Input
                  id='isbn'
                  name='isbn'
                  value={filter.isbn || ''}
                  onChange={handleInputChange}
                  placeholder='Tìm kiếm tên sách'
                />
              </div>

              {/* Khoảng giá */}
              <div className='col-span-4'>
                <Label htmlFor='priceRange'>Khoảng giá</Label>
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
              </div>

              {/* Ngôn ngữ - Accordion Checkbox */}
              <Accordion
                type='single'
                collapsible
                className='col-span-6 w-full'
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
                              checked={selectedLanguages.includes(lang)}
                              onCheckedChange={() => handleLanguageToggle(lang)}
                            />
                            <Label
                              htmlFor={`lang-${lang}`}
                              className='flex-grow cursor-pointer'
                            >
                              {VietnameseLanguageLabels[lang]}
                            </Label>
                            {selectedLanguages.includes(lang) && (
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
                className='col-span-6 w-full'
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
                                checked={selectedCategories.includes(
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
                              {selectedCategories.includes(category.id) && (
                                <Check className='h-4 w-4 text-primary' />
                              )}
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className='my-2 flex justify-end'>
              <Button variant='outline' onClick={handleReset}>
                Đặt lại
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default BookSearchFilter;
