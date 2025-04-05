'use client';

import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface StoreFormProps {
  initialData?: StoreData;
  isEditing?: boolean;
}

interface StoreData {
  id?: string;
  bookStoreName: string;
  address: string;
  phone: string;
  email: string;
  openingTime: string;
  closingTime: string;
  latitude: number;
  longitude: number;
  type: string;
  managerId: string;
  zoneId: string;
}

export default function StoreForm({
  initialData,
  isEditing = false
}: StoreFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StoreData>(
    initialData || {
      bookStoreName: '',
      address: '',
      phone: '',
      email: '',
      openingTime: '',
      closingTime: '',
      latitude: 0,
      longitude: 0,
      type: '',
      managerId: '',
      zoneId: ''
    }
  );

  // Mutation để tạo hoặc cập nhật cửa hàng
  const storeMutation = useMutation({
    mutationFn: (data: StoreData) => {
      if (isEditing) {
        return axios.put(`/api/stores/${initialData?.id}`, data);
      }
      return axios.post('/api/stores', data);
    },
    onSuccess: () => {
      router.push('/stores');
      router.refresh();
    }
  });

  // Hàm lấy vị trí hiện tại
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Lỗi khi lấy vị trí:', error);
          alert('Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ lấy vị trí.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    storeMutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Tên cửa hàng</label>
        <input
          type='text'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          value={formData.bookStoreName}
          onChange={(e) =>
            setFormData({ ...formData, bookStoreName: e.target.value })
          }
          required
        />
      </div>

      <div>
        <label className='block text-sm font-medium'>Địa chỉ</label>
        <input
          type='text'
          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
        />
      </div>

      {/* Các trường khác tương tự */}

      <div className='flex items-center space-x-4'>
        <div className='w-1/2'>
          <label className='block text-sm font-medium'>Latitude</label>
          <input
            type='number'
            step='any'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: parseFloat(e.target.value) })
            }
            required
          />
        </div>

        <div className='w-1/2'>
          <label className='block text-sm font-medium'>Longitude</label>
          <input
            type='number'
            step='any'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm'
            value={formData.longitude}
            onChange={(e) =>
              setFormData({
                ...formData,
                longitude: parseFloat(e.target.value)
              })
            }
            required
          />
        </div>
      </div>

      <div>
        <button
          type='button'
          className='rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700'
          onClick={getCurrentLocation}
        >
          Lấy vị trí hiện tại
        </button>
      </div>

      <div>
        <button
          type='submit'
          className='rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-800'
          disabled={storeMutation.isPending}
        >
          {storeMutation.isPending
            ? 'Đang xử lý...'
            : isEditing
              ? 'Cập nhật'
              : 'Tạo mới'}
        </button>
      </div>
    </form>
  );
}
