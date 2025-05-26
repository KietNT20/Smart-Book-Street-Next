import { usePublisherMutation } from '@/hooks/use-publisher';
import { useManagerEmail } from '@/hooks/use-user';
import { publisherFormSchema, PublisherFormValues } from '@/lib/zod';
import { Publisher } from '@/types/publisher-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
  const [userEmail, setUserEmail] = useState<string>('');
  const [shouldCheckEmail, setShouldCheckEmail] = useState<boolean>(false);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const {
    createPublisher,
    createPublisherPending,
    updatePublisher,
    updatePublisherPending,
  } = usePublisherMutation();

  // Only call useManagerEmail when we have an email AND shouldCheckEmail is true
  const { managerId, managerLoading, managerError } = useManagerEmail(
    shouldCheckEmail ? userEmail : ''
  );

  const isWorking =
    createPublisherPending || updatePublisherPending || managerLoading;

  // Modified removeMainImage function to reset the file input
  const handleRemoveMainImage = () => {
    removeMainImage();
    // Reset the file input value
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  // Modified removeAdditionalImage function to reset the file input
  const handleRemoveAdditionalImage = (index: number) => {
    removeAdditionalImage(index);
    // If all images are removed, reset the file input
    if (
      previewAdditionalFiles.length <= 1 &&
      additionalImagesInputRef.current
    ) {
      additionalImagesInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (managerError) {
      toast.error(
        'Email người phụ trách không có trong hệ thống hoặc nhập sai.'
      );
    }
  }, [managerError]);

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

  // Only update managerId in the form when it changes AND we've requested it
  useEffect(() => {
    if (managerId && shouldCheckEmail) {
      form.setValue('managerId', managerId);
    }
  }, [managerId, form, shouldCheckEmail]);

  // Function to validate manager email - call this explicitly when needed
  const validateManagerEmail = () => {
    if (userEmail.trim()) {
      setShouldCheckEmail(true);
    }
  };

  const removeMainImage = () => {
    // Clear preview
    setPreviewMainImage(null);

    // Clear form value
    form.setValue('mainImageFile', undefined);

    // Clear files state
    setFiles((prev) => ({ ...prev, mainFile: null }));
  };

  const removeAdditionalImage = (index: number) => {
    // Get current files from form state
    const currentFiles = [...files.additionalFiles];

    // Remove the file at the specified index
    currentFiles.splice(index, 1);

    // Update files state
    setFiles((prev) => ({
      ...prev,
      additionalFiles: currentFiles,
    }));

    // Update form value
    form.setValue('additionalImageFiles', currentFiles);

    // Update previews
    const updatedPreviews = [...previewAdditionalFiles];
    updatedPreviews.splice(index, 1);
    setPreviewAdditionalFiles(updatedPreviews);
  };

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

    if (values.mainImageFile instanceof File && typeof window !== 'undefined') {
      formData.set('MainImageFile', values.mainImageFile);
    }

    if (values.additionalImageFiles && typeof window !== 'undefined') {
      values.additionalImageFiles.forEach((file) => {
        if (file instanceof File) {
          formData.append('AdditionalImageFiles', file);
        }
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

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewMainImage(fileUrl);
    } else {
      setPreviewMainImage(null);
    }
  };

  const handleAdditionalFilesChange = (newFiles: File[]) => {
    setFiles((prev) => ({ ...prev, additionalFiles: newFiles }));

    const fileUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewAdditionalFiles(fileUrls);
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
    validateManagerEmail,
    files,
    userEmail,
    managerId,
    setShouldCheckEmail,
    mainImageInputRef,
    additionalImagesInputRef,
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
  };
};
