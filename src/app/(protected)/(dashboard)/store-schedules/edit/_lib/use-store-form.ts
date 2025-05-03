import { PATH } from '@/enums/path';
import { useStoreMutation } from '@/hooks/use-store';
import { storeFormSchema, StoreFormValues } from '@/lib/zod';
import { StoreData } from '@/types/store-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UseStoreFormProps = {
  storeToEdit: StoreData;
};

export const useStoreForm = ({ storeToEdit }: UseStoreFormProps) => {
  const [zoneDialogOpen, setZoneDialogOpen] = useState(false);
  const [selectedZoneName, setSelectedZoneName] = useState('');
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState<
    string[]
  >([]);

  const router = useRouter();

  const { updateStore, isUpdatingStore } = useStoreMutation();

  const isWorking = isUpdatingStore;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: storeToEdit,
  });

  // Zone handlers
  const handleSelectZone = (zoneId: string, zoneName: string) => {
    form.setValue('zoneId', zoneId, { shouldValidate: true });
    setSelectedZoneName(zoneName);
    setZoneDialogOpen(false);
  };

  const toggleZoneDialog = () => {
    setZoneDialogOpen((prev) => !prev);
  };

  // Form submission handler
  const onSubmit = (values: StoreFormValues) => {
    try {
      const formData = new FormData();
      formData.append('StoreName', values.storeName);
      formData.append('Address', values.address);

      if (values.phone) {
        formData.append('Phone', values.phone);
      }

      if (values.email) {
        formData.append('Email', values.email);
      }

      if (values.mainImageFile && typeof window !== 'undefined') {
        formData.set('MainImageFile', values.mainImageFile);
      }

      if (values.additionalImageFiles && typeof window !== 'undefined') {
        values.additionalImageFiles.forEach((file) => {
          formData.append('AdditionalImageFiles', file);
        });
      }

      formData.append('Latitude', values.latitude?.toString() || '0');
      formData.append('Longitude', values.longitude?.toString() || '0');

      if (values.type) {
        formData.append('Type', values.type);
      }

      if (values.zoneId) {
        formData.append('ZoneId', values.zoneId);
      }

      if (storeToEdit) {
        if (!storeToEdit.id) {
          throw new Error('Store ID is missing for update operation');
        }
        updateStore(
          { id: storeToEdit.id, data: formData },
          {
            onSuccess: (data) => {
              if (data) {
                router.replace(PATH.STORE_HOURS);
                form.reset();
              }
            },
          }
        );
      }

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // File handlers
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'mainImageFile' | 'additionalImageFiles'
  ) => {
    const files = e.target.files;

    if (!files) return;

    if (fieldName === 'mainImageFile' && files[0]) {
      const file = files[0];
      form.setValue('mainImageFile', file, { shouldValidate: true });
      const imageUrl = URL.createObjectURL(file);
      setPreviewMainImage(imageUrl);
    } else if (fieldName === 'additionalImageFiles') {
      const fileArray = Array.from(files);
      form.setValue('additionalImageFiles', fileArray, {
        shouldValidate: true,
      });

      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewAdditionalImages(imageUrls);
    }
  };

  // Remove handlers
  const removeMainImage = () => {
    setPreviewMainImage(null);
    form.setValue('mainImageFile', null, { shouldValidate: true });
  };

  const removeAdditionalImage = (index: number) => {
    const currentFiles = form.getValues('additionalImageFiles');
    const updatedFiles = [...(currentFiles || [])];
    updatedFiles.splice(index, 1);
    form.setValue('additionalImageFiles', updatedFiles, {
      shouldValidate: true,
    });

    const updatedPreviews = [...previewAdditionalImages];
    updatedPreviews.splice(index, 1);
    setPreviewAdditionalImages(updatedPreviews);
  };

  // Navigation handlers
  const handleCancel = () => {
    router.replace(PATH.STORE_HOURS);
  };

  return {
    form,
    isWorking,
    zoneDialogOpen,
    selectedZoneName,
    previewMainImage,
    previewAdditionalImages,
    handleSelectZone,
    toggleZoneDialog,
    onSubmit,
    handleFileChange,
    removeMainImage,
    removeAdditionalImage,
    handleCancel,
  };
};
