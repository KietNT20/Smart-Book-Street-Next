import { BookFormValues } from '@/lib/zod';
import DOMPurify from 'isomorphic-dompurify';
import { useEffect, useState } from 'react';

type FileState = {
  mainFile: File | null;
  additionalFiles: File[];
  mainPreviewUrl: string | null;
  additionalPreviewUrls: string[];
};

export function useBookFormSubmit(
  onSubmit: (formData: FormData) => void,
  initialMainImageUrl?: string
) {
  const [files, setFiles] = useState<FileState>({
    mainFile: null,
    additionalFiles: [],
    mainPreviewUrl: null,
    additionalPreviewUrls: [],
  });

  // Set initial preview if book has images
  useEffect(() => {
    if (initialMainImageUrl) {
      setFiles((prev) => ({
        ...prev,
        mainPreviewUrl: initialMainImageUrl,
      }));
    }

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      if (files.mainPreviewUrl && !files.mainPreviewUrl.startsWith('http')) {
        URL.revokeObjectURL(files.mainPreviewUrl);
      }

      files.additionalPreviewUrls.forEach((url) => {
        if (!url.startsWith('http')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [initialMainImageUrl, files.mainPreviewUrl, files.additionalPreviewUrls]);

  const handleMainFileChange = (file: File | null) => {
    // Cleanup previous object URL if it exists
    if (files.mainPreviewUrl && !files.mainPreviewUrl.startsWith('http')) {
      URL.revokeObjectURL(files.mainPreviewUrl);
    }

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setFiles((prev) => ({
        ...prev,
        mainFile: file,
        mainPreviewUrl: previewUrl,
      }));
    } else {
      setFiles((prev) => ({
        ...prev,
        mainFile: null,
        mainPreviewUrl: null,
      }));
    }
  };

  const handleAdditionalFilesChange = (newFiles: File[]) => {
    // Cleanup previous object URLs
    files.additionalPreviewUrls.forEach((url) => {
      if (!url.startsWith('http')) {
        URL.revokeObjectURL(url);
      }
    });

    // Create new preview URLs for all files
    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));

    setFiles((prev) => ({
      ...prev,
      additionalFiles: newFiles,
      additionalPreviewUrls: newPreviewUrls,
    }));
  };

  const handleRemoveMainImage = (
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    // Cleanup object URL if it exists
    if (files.mainPreviewUrl && !files.mainPreviewUrl.startsWith('http')) {
      URL.revokeObjectURL(files.mainPreviewUrl);
    }

    // Reset file state
    setFiles((prev) => ({
      ...prev,
      mainFile: null,
      mainPreviewUrl: null,
    }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAdditionalImage = (
    index: number,
    fileInputRef: React.RefObject<HTMLInputElement>
  ) => {
    // Cleanup object URL
    const urlToRemove = files.additionalPreviewUrls[index];
    if (urlToRemove && !urlToRemove.startsWith('http')) {
      URL.revokeObjectURL(urlToRemove);
    }

    // Remove the file and preview URL at the specified index
    const newFiles = [...files.additionalFiles];
    newFiles.splice(index, 1);

    const newUrls = [...files.additionalPreviewUrls];
    newUrls.splice(index, 1);

    setFiles((prev) => ({
      ...prev,
      additionalFiles: newFiles,
      additionalPreviewUrls: newUrls,
    }));

    // Reset the file input if all files are removed
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (values: BookFormValues) => {
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
      if (values.publisherId) {
        formData.append('PublisherId', values.publisherId);
      }

      if (values.authorIds && values.authorIds.length > 0) {
        values.authorIds.forEach((id) => formData.append('AuthorIds', id));
      }

      if (values.categoryIds && values.categoryIds.length > 0) {
        values.categoryIds.forEach((id) => formData.append('CategoryIds', id));
      }

      if (files.mainFile instanceof File) {
        formData.set('MainImageFile', files.mainFile);
      }

      if (Array.isArray(files.additionalFiles)) {
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
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
    handleSubmit,
  };
}
