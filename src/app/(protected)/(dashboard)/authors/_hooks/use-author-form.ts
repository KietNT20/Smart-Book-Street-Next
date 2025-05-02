import { useAuthorMutation } from '@/hooks/use-author';
import { authorFormSchema, AuthorFormValues } from '@/lib/zod';
import { Author } from '@/types/author-types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type FileState = {
  imgFile: File | null;
  previewUrl: string | null;
};

type Props = {
  author?: Author;
};

export const useAuthorForm = ({ author }: Props) => {
  const [file, setFile] = useState<FileState>({
    imgFile: null,
    previewUrl: null,
  });

  const {
    createAuthor,
    createAuthorPending,
    updateAuthor,
    updateAuthorPending,
  } = useAuthorMutation();

  const isSubmitting = createAuthorPending || updateAuthorPending;

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      authorName: '',
      nationality: '',
      biography: '',
      dob: '',
      imgFile: undefined,
    },
  });

  const fileInputRef = useState<React.RefObject<HTMLInputElement>>(
    () => ({ current: null }) as React.RefObject<HTMLInputElement>
  )[0];

  // Set initial image preview if author has an image
  useEffect(() => {
    if (author) {
      form.reset({
        authorName: author.authorName,
        dob: author.dob ? dayjs(author.dob).format('YYYY-MM-DD') : '',
        nationality: author.nationality,
        biography: author.biography,
        imgFile: undefined,
      });

      // If author has an image URL, set it as preview
      if (author.baseImgUrl) {
        setFile((prev) => ({
          ...prev,
          previewUrl: author.baseImgUrl || null,
        }));
      }
    }
  }, [author, form]);

  // Clean up object URL when component unmounts or when new file is selected
  useEffect(() => {
    return () => {
      if (file.previewUrl && !file.previewUrl.startsWith('http')) {
        URL.revokeObjectURL(file.previewUrl);
      }
    };
  }, [file.previewUrl]);

  const onSubmit = (data: AuthorFormValues) => {
    try {
      const formData = new FormData();
      formData.append('AuthorName', data.authorName);
      formData.append('DOB', data.dob || '');
      formData.append('Nationality', data.nationality || '');
      formData.append('Biography', data.biography || '');
      if (data.imgFile && typeof window !== 'undefined') {
        formData.set('ImgFile', data.imgFile);
      }
      if (author?.id) {
        updateAuthor({ id: author.id, formData });
      } else {
        createAuthor(formData);
      }
    } catch (error: unknown) {
      console.error('Error author submit:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleImageFileChange = (file: File | null) => {
    if (typeof window !== 'undefined') {
      if (file) {
        // Create a preview URL for the selected file
        const previewUrl = URL.createObjectURL(file);
        setFile({ imgFile: file, previewUrl });
      } else {
        setFile({ imgFile: null, previewUrl: null });
      }
    }
  };

  const handleRemoveImage = () => {
    // Clean up the object URL if it exists
    if (file.previewUrl && !file.previewUrl.startsWith('http')) {
      URL.revokeObjectURL(file.previewUrl);
    }

    // Reset file state
    setFile({ imgFile: null, previewUrl: null });

    // Reset the file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Reset the form field
    form.setValue('imgFile', undefined);
  };

  return {
    form,
    file,
    isSubmitting,
    fileInputRef,
    onSubmit,
    handleImageFileChange,
    handleRemoveImage,
    createAuthorPending,
    updateAuthorPending,
  };
};
