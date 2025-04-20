'use client';

import CancelButton from '@/components/back-btn/cancel-btn';
import SubmitBtn from '@/components/button/submit-btn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { STORAGE } from '@/constant/storage';
import { PATH } from '@/enums/path';
import useDebounce from '@/hooks/use-debounce';
import { useZoneMutation } from '@/hooks/use-zone';
import { zoneFormSchema, ZoneFormSchema } from '@/lib/zod';
import { Zone } from '@/types/zone-types';
import { getLocalStorageItem } from '@/utils/token';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AddressZone from './address-zone';

type Props = {
  zoneToEdit?: Zone;
};

const ZoneForm = ({ zoneToEdit }: Props) => {
  const streetId = getLocalStorageItem(STORAGE.SELECTED_STREET_KEY);
  const form = useForm<ZoneFormSchema>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues: {
      zoneName: zoneToEdit?.zoneName || '',
      description: zoneToEdit?.description || undefined,
      latitude: zoneToEdit?.latitude || 0,
      longitude: zoneToEdit?.longitude || 0,
    },
  });
  const { createZone, isCreatingZone, updateZone, isUpdatingZone } =
    useZoneMutation();
  const isWorking = useDebounce(isCreatingZone || isUpdatingZone, 300);

  function onSubmit(values: ZoneFormSchema) {
    console.log(values);
    if (zoneToEdit) {
      updateZone({
        id: zoneToEdit.id,
        payload: {
          ...values,
          streetId: streetId || null,
        },
      });
    } else {
      createZone({
        ...values,
        streetId: streetId || null,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {zoneToEdit ? 'Cập Nhật Khu Vực' : 'Tạo Mới Khu Vực'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='zoneName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên khu vực</FormLabel>
                  <FormControl>
                    <Input placeholder='Nhập tên khu vực' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Address and Location */}
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Địa chỉ và vị trí</CardTitle>
              </CardHeader>
              <CardContent>
                <AddressZone form={form} disabled={isWorking} />
                <div className='mt-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    control={form.control}
                    name='latitude'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vĩ độ</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Vĩ độ'
                            disabled={isWorking}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='longitude'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kinh độ</FormLabel>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder='Kinh độ'
                            disabled={isWorking}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            <div className='flex items-center justify-end gap-4'>
              <CancelButton
                _isPending={isWorking}
                pathUrl={PATH.ZONES}
                routerReplace
              />
              <SubmitBtn ID={zoneToEdit?.id} _onPending={isWorking} />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ZoneForm;
