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
import { Zone } from '@/types/zone-types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddressZone from './address-zone';

export const zoneFormSchema = z.object({
  zoneName: z.string().min(1, { message: 'Vui lòng nhập tên khu vực' }),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type ZoneFormSchema = z.infer<typeof zoneFormSchema>;

type Props = {
  zoneToEdit?: Zone;
};

const ZoneForm = ({ zoneToEdit }: Props) => {
  const streetId = localStorage.getItem(STORAGE.SELECTED_STREET_KEY);
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

  // 2. Define a submit handler.
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
        <CardTitle className='text-lg'>
          {zoneToEdit ? 'Cập nhật khu vực' : 'Tạo mới khu vực'}
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
