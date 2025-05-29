import { useRolesAvailable } from '@/hooks/use-role';
import { useUserMutation } from '@/hooks/use-user';
import { userFormSchema, UserFormValues } from '@/lib/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

export const useUserForm = () => {
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
  const [useDefaultPassword, setUseDefaultPassword] = useState<boolean>(true);
  const { createUser, createUserPending } = useUserMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { rolesAvailable, isLoadingRolesAvailable } = useRolesAvailable();

  const isWorking = createUserPending;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: 'User@12345',
      fullName: '',
      phone: '',
      dob: null,
      address: '',
      gender: undefined,
      mainImageFile: null,
      requestedRoleId: '',
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

      if (values.requestedRoleId) {
        formData.append('RequestedRoleId', values.requestedRoleId);
      }

      if (values.mainImageFile && typeof window !== 'undefined') {
        formData.set('MainImageFile', values.mainImageFile);
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

      if (typeof window !== 'undefined') {
        const fileUrl = URL.createObjectURL(file);
        setPreviewMainImage(fileUrl);
      }
    }
  };

  const removeMainImage = () => {
    if (previewMainImage) {
      URL.revokeObjectURL(previewMainImage);
    }

    setPreviewMainImage(null);
    form.setValue('mainImageFile', null, { shouldValidate: true });

    // Reset using the ref
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleDefaultPassword = () => {
    setUseDefaultPassword((prev) => !prev);
    if (useDefaultPassword) {
      // If using default password, set it to empty string
      form.setValue('password', '', { shouldValidate: true });
    } else {
      // If not using default password and selected again, set to default password
      form.setValue('password', 'User@12345', { shouldValidate: true });
    }
  };

  return {
    form,
    isWorking,
    onSubmit,
    previewMainImage,
    handleMainFileChange,
    removeMainImage,
    fileInputRef,
    toggleDefaultPassword,
    useDefaultPassword,
    rolesAvailable,
    isLoadingRolesAvailable,
  };
};
