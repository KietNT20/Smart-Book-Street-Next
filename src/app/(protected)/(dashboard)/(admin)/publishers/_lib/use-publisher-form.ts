'use client';

import useDebounce from '@/hooks/use-debounce';
import { usePublisherMutation } from '@/hooks/use-publisher';
import { useManagerEmail } from '@/hooks/use-user';
import { publisherFormSchema, PublisherFormValues } from '@/lib/zod';
import { Publisher } from '@/types/publisher-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FileState = {
  mainFile: File | null;
  additionalFiles: File[];
};

type Props = {
  publisher?: Publisher;
};

export const usePublisherForm = ({ publisher }: Props = {}) => {
  const [files, setFiles] = useState<FileState>({
    mainFile: null,
    additionalFiles: [],
  });
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
  const [previewAdditionalFiles, setPreviewAdditionalFiles] = useState<
    string[]
  >([]);
  const [userEmail, setUserEmail] = useState('');

  const {
    createPublisher,
    createPublisherPending,
    updatePublisher,
    updatePublisherPending,
  } = usePublisherMutation();

  const { managerId } = useManagerEmail(userEmail);

  const isWorking = useDebounce(
    createPublisherPending || updatePublisherPending,
    300
  );

  const form = useForm<PublisherFormValues>({
    resolver: zodResolver(publisherFormSchema),
    defaultValues: {
      publisherName: publisher?.publisherName || '',
      phone: publisher?.phone || '',
      email: publisher?.email || '',
      managerId: publisher?.managerId || '',
      address: publisher?.address || '',
      description: publisher?.description || '',
      website: publisher?.website || '',
      mainImageFile: undefined,
      additionalImageFiles: [],
    },
  });

  const removeAdditionalImage = (index: number) => {
    const currentFiles = form.getValues('additionalImageFiles');
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    form.setValue('additionalImageFiles', updatedFiles);

    const updatedPreviews = [...previewAdditionalFiles];
    updatedPreviews.splice(index, 1);
    setPreviewAdditionalFiles(updatedPreviews);
  };

  useEffect(() => {
    if (managerId) {
      form.setValue('managerId', managerId);
    }
  }, [managerId, form]);

  function _onSubmit(values: PublisherFormValues) {
    const formData = new FormData();
    if (values.publisherName) {
      formData.append('PublisherName', values.publisherName);
    }

    if (values.phone) {
      formData.append('Phone', values.phone);
    }

    if (values.email) {
      formData.append('Email', values.email);
    }

    if (managerId) {
      formData.append('ManagerId', managerId);
    }

    if (values.address) {
      formData.append('Address', values.address);
    }

    if (values.description) {
      formData.append('Description', values.description);
    }

    if (values.website) {
      formData.append('Website', values.website);
    }

    if (values.mainImageFile) {
      formData.append(
        'MainImageFile',
        values.mainImageFile instanceof File
          ? values.mainImageFile
          : new Blob([values.mainImageFile])
      );
    }

    if (values.additionalImageFiles) {
      values.additionalImageFiles.forEach((file) => {
        formData.append(
          'AdditionalImageFiles',
          file instanceof File ? file : new Blob([file])
        );
      });
    }

    if (publisher?.id) {
      updatePublisher({
        id: publisher.id,
        formData,
      });
    } else {
      createPublisher(formData);
    }
  }

  const handleMainFileChange = (file: File | null) => {
    setFiles((prev) => ({ ...prev, mainFile: file }));

    // Tạo URL để xem trước ảnh
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewMainImage(fileUrl);
    } else {
      setPreviewMainImage(null);
    }
  };

  const handleAdditionalFilesChange = (newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, additionalFiles: newFiles }));

    // Tạo URL để xem trước các ảnh bổ sung
    const fileUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewAdditionalFiles(fileUrls);
  };

  // Hàm xóa ảnh chính
  const removeMainImage = () => {
    setPreviewMainImage(null);
    form.setValue('mainImageFile', undefined);
    setFiles((prev) => ({ ...prev, mainFile: null }));
  };

  return {
    form,
    isWorking,
    onSubmit: _onSubmit,
    previewMainImage,
    previewAdditionalFiles,
    handleMainFileChange,
    handleAdditionalFilesChange,
    removeMainImage,
    removeAdditionalImage,
    setUserEmail,
    files,
    userEmail,
    managerId,
  };
};
