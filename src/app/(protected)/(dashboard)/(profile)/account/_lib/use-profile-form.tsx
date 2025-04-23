import { useUserMutation } from '@/hooks/use-user';
import { userFormSchema, UserFormValues } from '@/lib/zod';
import { User } from '@/types/user-types';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export type UseUserFormProps = {
  user: User & {
    id: string;
  };
};

export const useProfileForm = ({ user }: UseUserFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const { updateUser, updateUserPending } = useUserMutation();

  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      fullName: '',
      phone: '',
      dob: null,
      address: '',
      gender: undefined,
      mainImageFile: null,
      additionalImageFiles: [],
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        userName: user.userName || '',
        email: user.email || '',
        password: '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        dob: user.dob ? dayjs(user.dob).format('YYYY-MM-DD') : null,
        address: user.address || '',
        gender: user.gender || undefined,
        mainImageFile: user.mainImageFile || null,
        additionalImageFiles: user.additionalImageFiles || [],
      });

      if (user.mainImageFile) {
        setPreviewImage(user.mainImageFile);
      }
    }
  }, [user, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      form.setValue('mainImageFile', file as any);

      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
    }
  };

  const onSubmit = (values: UserFormValues) => {
    const formData = new FormData();

    if (values.email) {
      formData.append('Email', values.email);
    }

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

    if (selectedImage instanceof File && typeof window !== 'undefined') {
      formData.append('MainImageFile', selectedImage);
    } else if (values.mainImageFile instanceof File) {
      formData.append('MainImageFile', values.mainImageFile);
    }

    if (
      values.additionalImageFiles &&
      values.additionalImageFiles.length > 0 &&
      typeof window !== 'undefined'
    ) {
      values.additionalImageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('AdditionalImageFiles', file);
        }
      });
    }

    updateUser({
      id: user.id || '',
      formData: formData,
    });

    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedImage(null);
    // Reset form về giá trị ban đầu
    if (user) {
      form.reset({
        userName: user.userName || '',
        email: user.email || '',
        password: '',
        fullName: user.fullName || '',
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString() : null,
        address: user.address || '',
        gender: user.gender || undefined,
        mainImageFile: user.mainImageFile || null,
        additionalImageFiles: user.additionalImageFiles || [],
      });

      if (user.mainImageFile) {
        setPreviewImage(user.mainImageFile);
      } else {
        setPreviewImage('');
      }
    }
  };

  return {
    form,
    isEditing,
    isSubmitting: updateUserPending,
    previewImage,
    selectedImage,
    handleImageChange,
    onSubmit,
    startEditing,
    cancelEdit,
  };
};

export default useProfileForm;
