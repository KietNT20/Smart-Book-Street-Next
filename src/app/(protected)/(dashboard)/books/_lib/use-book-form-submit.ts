import { BookFormValues } from '@/lib/zod';
import DOMPurify from 'dompurify';
import { useState } from 'react';

type FileState = {
  mainFile: File | null;
  additionalFiles: File[];
};

export function useBookFormSubmit(onSubmit: (formData: FormData) => void) {
  const [files, setFiles] = useState<FileState>({
    mainFile: null,
    additionalFiles: [],
  });

  const handleMainFileChange = (file: File | null) => {
    setFiles((prev) => ({ ...prev, mainFile: file }));
  };

  const handleAdditionalFilesChange = (newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, additionalFiles: newFiles }));
  };

  const handleSubmit = async (values: BookFormValues) => {
    try {
      const formData = new FormData();

      // Sanitize HTML content from rich text editor
      const sanitizedDescription = values.description
        ? DOMPurify.sanitize(values.description)
        : '';

      formData.append('ISBN', values.isbn || '');
      formData.append('Title', values.title || '');
      formData.append('PublicationDate', values.publicationDate || '');
      formData.append('Price', (values.price ?? 0).toString());
      formData.append('Languages', values.languages || '');
      formData.append('Description', sanitizedDescription);
      formData.append('Size', values.size || '');
      formData.append('Status', values.status || '');
      formData.append('PublisherId', values.publisherId || '');

      if (values.authorIds && values.authorIds.length > 0) {
        values.authorIds.forEach((id) => formData.append('AuthorIds', id));
      }

      if (values.categoryIds && values.categoryIds.length > 0) {
        values.categoryIds.forEach((id) => formData.append('CategoryIds', id));
      }

      if (files.mainFile && typeof window !== 'undefined') {
        formData.set('MainImageFile', files.mainFile);
      }

      if (files.additionalFiles && typeof window !== 'undefined') {
        files.additionalFiles.forEach((file) => {
          formData.append('AdditionalImageFiles', file);
        });
      }

      onSubmit(formData);
    } catch (error) {
      console.error('Error preparing form data:', error);
    }
  };

  return {
    files,
    handleMainFileChange,
    handleAdditionalFilesChange,
    handleSubmit,
  };
}
