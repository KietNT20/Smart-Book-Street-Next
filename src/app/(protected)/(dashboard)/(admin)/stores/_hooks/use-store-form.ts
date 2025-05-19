import { PATH } from '@/enums/path';
import { useStoreMutation } from '@/hooks/use-store';
import { useZonesByStreet } from '@/hooks/use-zone';
import { storeFormSchema, StoreFormValues } from '@/lib/zod';
import { StoreData } from '@/types/store-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type UseStoreFormProps = {
  storeToEdit?: StoreData;
};

export const useStoreForm = ({ storeToEdit }: UseStoreFormProps = {}) => {
  const [previewMainImage, setPreviewMainImage] = useState<string | null>(null);
  const [previewAdditionalImages, setPreviewAdditionalImages] = useState<
    string[]
  >([]);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImagesInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const { createStore, updateStore, isCreatingStore, isUpdatingStore } =
    useStoreMutation();
  const { zonesByStreetRes, isLoadingZonesByStreet } = useZonesByStreet();

  const isWorking = isCreatingStore || isUpdatingStore;

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: storeToEdit || {
      storeName: '',
      address: '',
      mainImageFile: null,
      additionalImageFiles: [],
      latitude: 0,
      longitude: 0,
      type: '',
      zoneId: '',
    },
  });

  const onSubmit = (values: StoreFormValues) => {
    const formData = new FormData();
    formData.append('StoreName', values.storeName);
    formData.append('Address', values.address);

    if (values.mainImageFile instanceof File && typeof window !== 'undefined') {
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

    if (storeToEdit?.id) {
      updateStore(
        { id: storeToEdit.id, data: formData },
        {
          onSuccess: (data) => {
            if (data) {
              router.replace(PATH.STORES);
              form.reset();
            }
          },
        }
      );
    } else {
      createStore(formData, {
        onSuccess: (data) => {
          if (data) {
            router.replace(PATH.STORES);
            form.reset();
          }
        },
      });
    }
  };

  const handleRemoveMainImage = () => {
    removeMainImage();
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  const handleRemoveAdditionalImage = (index: number) => {
    removeAdditionalImage(index);
    if (
      previewAdditionalImages.length <= 1 &&
      additionalImagesInputRef.current
    ) {
      additionalImagesInputRef.current.value = '';
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
      setMainFile(file);
      form.setValue('mainImageFile', file, { shouldValidate: true });
      const imageUrl = URL.createObjectURL(file);
      setPreviewMainImage(imageUrl);
    } else if (fieldName === 'additionalImageFiles') {
      const fileArray = Array.from(files);
      setAdditionalFiles(fileArray);
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
    setMainFile(null);
    form.setValue('mainImageFile', null, { shouldValidate: true });
  };

  const removeAdditionalImage = (index: number) => {
    const newFiles = [...additionalFiles];
    newFiles.splice(index, 1);
    setAdditionalFiles(newFiles);

    form.setValue('additionalImageFiles', newFiles, {
      shouldValidate: true,
    });

    const updatedPreviews = [...previewAdditionalImages];
    updatedPreviews.splice(index, 1);
    setPreviewAdditionalImages(updatedPreviews);
  };

  // Navigation handlers
  const handleCancel = () => {
    router.replace(PATH.STORES);
  };

  return {
    form,
    isWorking,
    previewMainImage,
    previewAdditionalImages,
    onSubmit,
    handleFileChange,
    removeMainImage,
    removeAdditionalImage,
    handleCancel,
    mainFile,
    additionalFiles,
    mainImageInputRef,
    additionalImagesInputRef,
    handleRemoveMainImage,
    handleRemoveAdditionalImage,
    zonesByStreetRes,
    isLoadingZonesByStreet,
  };
};
