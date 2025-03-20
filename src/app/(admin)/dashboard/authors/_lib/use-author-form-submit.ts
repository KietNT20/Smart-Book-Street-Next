import { AuthorFormValues } from '@/lib/zod';
import { useState } from 'react';
import { toast } from 'sonner';

type FileState = {
  imgFile: File | null;
};

export function useBookFormSubmit(onSubmit: (formData: FormData) => void) {
  const [file, setFile] = useState<FileState>({
    imgFile: null
  });

  const handleImageFileChange = (file: File | null) => {
    setFile((prev) => ({ ...prev, imgFile: file }));
  };

  const handleSubmit = async (values: AuthorFormValues) => {
    try {
      const formData = new FormData();
      formData.append('AuthorName', values.authorName);
      formData.append('DOB', values.dob || '');
      formData.append('Nationality', values.nationality || '');
      formData.append('Biography', values.biography || '');
      if (values.imgFile) {
        formData.append('ImgFile', values.imgFile);
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
    handleSubmit
  };
}
