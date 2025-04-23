import useDebounce from '@/hooks/use-debounce';
import { useSouvenirMutation } from '@/hooks/use-souvenir';
import { souvenirFormSchema, SouvenirFormValues } from '@/lib/zod';
import { Souvenir } from '@/types/souvenir-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
  souvenirToEdit?: Souvenir;
};

export function useSouvenirForm({ souvenirToEdit }: Props) {
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);

  const {
    createSouvenir,
    updateSouvenir,
    isCreatingSouvenir,
    isUpdatingSouvenir,
  } = useSouvenirMutation();
  const isPending = useDebounce(isCreatingSouvenir || isUpdatingSouvenir, 300);

  const form = useForm<SouvenirFormValues>({
    resolver: zodResolver(souvenirFormSchema),
    defaultValues: {
      souvenirName: souvenirToEdit?.souvenirName || '',
      price: souvenirToEdit?.price || 0,
      description: souvenirToEdit?.description || '',
      baseImgFile: souvenirToEdit?.baseImgUrl || '',
    },
  });

  const onSubmit = (data: SouvenirFormValues) => {
    const formData = new FormData();

    if (data.souvenirName) {
      formData.append('SouvenirName', data.souvenirName);
    }
    if (data.price) {
      formData.append('Price', data.price.toString());
    }
    if (data.description) {
      formData.append('Description', data.description);
    }

    if (data.baseImgFile instanceof File && typeof window !== 'undefined') {
      formData.append('BaseImgFile', data.baseImgFile);
    }

    if (souvenirToEdit) {
      updateSouvenir({
        id: souvenirToEdit?.id as string,
        data: formData,
      });
    } else {
      createSouvenir(formData);
    }
  };

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('baseImgFile', file);
    }
  };

  return {
    form,
    onSubmit,
    handleMainImageChange,
    mainImagePreview,
    isPending,
  };
}
