import { AuthorFormValues } from '@/lib/zod';
import { useState } from 'react';
import { toast } from 'sonner';

export function useBookFormSubmit(onSubmit: (formData: FormData) => void) {
  const [file, setFile] = useState<File | null>(null);

  const handleImageFileChange = (file: File | null) => {
    setFile(file);
  };

  const handleSubmit = async (values: AuthorFormValues) => {
    try {
      const formData = new FormData();
      formData.append('AuthorName', values.authorName);
      formData.append('DOB', values.dob || '');
      formData.append('Nationality', values.nationality || '');
      formData.append('Biography', values.biography || '');
      if (values.imgFile && typeof window !== 'undefined') {
        formData.set('ImgFile', values.imgFile);
      }
      onSubmit(formData);
    } catch (error: unknown) {
      console.error('Error preparing form data:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return {
    file,
    handleImageFileChange,
    handleSubmit,
  };
}
