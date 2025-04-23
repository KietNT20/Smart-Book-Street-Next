import useDebounce from '@/hooks/use-debounce';
import { useUserMutation } from '@/hooks/use-user';
import { userFormSchema, UserFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export const useUserForm = () => {
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
  const { createUser, createUserPending } = useUserMutation();
  const isWorking = useDebounce(createUserPending, 300);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: undefined,
      fullName: '',
      phone: '',
      dob: null,
      address: '',
      gender: undefined,
      mainImageFile: null,
      additionalImageFiles: [],
    },
  });

  function onSubmit(values: UserFormValues) {
    try {
      const formData = new FormData();

      if (values.userName) {
        formData.append('UserName', values.userName);
      }

      if (values.email) {
        formData.append('Email', values.email);
      }

      if (values.password) {
        formData.append('Password', values.password);
      }

      if (values.fullName) {
        formData.append('FullName', values.fullName);
      }

      if (values.phone) {
        formData.append('Phone', values.phone);
      }

      if (values.dob) {
        formData.append('Dob', values.dob);
      }

      if (values.address) {
        formData.append('Addresss', values.address);
      }

      if (values.gender) {
        formData.append('Gender', values.gender);
      }

      if (
        values.mainImageFile instanceof File &&
        typeof window !== 'undefined'
      ) {
        formData.append('MainImageFile', values.mainImageFile);
      }
      createUser(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }

  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('mainImageFile', file, { shouldValidate: true });

      const imageUrl = URL.createObjectURL(file);
      setPreviewMainImage(imageUrl);
    }
  };

  const removeMainImage = () => {
    setPreviewMainImage(null);
    form.setValue('mainImageFile', null, { shouldValidate: true });
  };

  return {
    form,
    isWorking,
    onSubmit,
    previewMainImage,
    handleMainFileChange,
    removeMainImage,
  };
};
