import { REGEX } from '@/constant/regex';
import { Gender } from '@/enums/gender';
import { StoreRent } from '@/enums/store-rent';
import dayjs from 'dayjs';
import * as z from 'zod';

const MAX_BASE_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_OTHER_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Login form
export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, { message: 'Vui lòng nhập tài khoản hoặc email' })
    .refine(
      (value) => {
        // Check if it's a valid email or username
        const emailRegex = REGEX.EMAIL;
        const usernameRegex = REGEX.USERNAME;

        return emailRegex.test(value) || usernameRegex.test(value);
      },
      {
        message: 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ',
      }
    ),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Register form
export const registerSchema = z
  .object({
    userName: z.string().min(1, { message: 'Vui lòng nhập tên tài khoản' }),
    email: z
      .string()
      .min(1, { message: 'Vui lòng nhập email' })
      .email({ message: 'Email không hợp lệ' }),
    password: z
      .string()
      .min(8, { message: 'Mật khẩu cần ít nhất 8 kí tự' })
      .max(32, { message: 'Mật khẩu không được quá 32 kí tự' })
      .regex(/[A-Z]/, { message: 'Mật khẩu cần ít nhất 1 chữ hoa' })
      .regex(/[a-z]/, { message: 'Mật khẩu cần ít nhất 1 chữ thường' })
      .regex(/[0-9]/, { message: 'Mật khẩu cần ít nhất 1 số' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt',
      }),
    fullName: z
      .string()
      .min(1, { message: 'Vui lòng nhập họ và tên' })
      .optional(),
    phone: z
      .string()
      .min(1, { message: 'Vui lòng nhập số điện thoại' })
      .refine(
        (val) => {
          if (!val) return true;
          return REGEX.PHONE_VN.test(val);
        },
        {
          message: 'Số điện thoại không hợp lệ',
        }
      ),
    gender: z.nativeEnum(Gender).optional(),
    requestedRoleId: z.string().nonempty({
      message: 'Bạn là ai?',
    }),
  })
  .refine((data) => !/[^\x00-\x7F]/.test(data.password), {
    message: 'Mật khẩu không được chứa emoji hoặc ký tự không hợp lệ',
    path: ['password'],
  });

// Book form
const bookPublishedDatedSchema = z.string().refine(
  (value) => {
    return (
      /^\d{4}$/.test(value) ||
      /^\d{4}-\d{2}$/.test(value) ||
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    );
  },
  {
    message: 'Ngày xuất bản không hợp lệ',
  }
);

export const bookSchema = z.object({
  isbn: z.string().min(1, { message: 'Mã sách không được để trống' }),
  title: z.string().min(1, { message: 'Tên sách không được để trống' }),
  publicationDate: bookPublishedDatedSchema,
  price: z.number().min(1000, { message: 'Số tiền không hợp lệ' }),
  languages: z.string().nonempty({
    message: 'Vui lòng chọn ngôn ngữ sách',
  }),
  description: z.string().optional(),
  size: z.string().optional(),
  status: z.string().optional().nullable(),
  mainImageFile: z.union([
    z
      .instanceof(File, { message: 'Vui lòng tải lên ảnh chính' })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File phải nhỏ hơn 5MB',
      })
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        {
          message: 'Chỉ chấp nhận JPG, PNG, WEBP',
        }
      ),
    z.string().nonempty({
      message: 'Vui lòng tải lên ảnh chính',
    }),
  ]),
  additionalImageFiles: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Mỗi file phải nhỏ hơn 5MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
              message: 'Chỉ chấp nhận JPG, PNG, WEBP',
            }
          ),
        z.string(),
      ])
    )
    .default([])
    .refine((files) => files.length <= 4, {
      message: 'Chỉ có thể tải lên tối đa 4 hình ảnh bổ sung',
    }),
  publisherId: z.string().optional(),
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;

// Author form
export const authorFormSchema = z.object({
  authorName: z.string().min(1, 'Tên tác giả là bắt buộc'),
  dob: z.string().date().optional(),
  nationality: z.string().optional(),
  biography: z.string().optional(),
  imgFile: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 2 * 1024 * 1024, {
          message: 'File phải nhỏ hơn 2MB',
        })
        .refine(
          (file) =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          {
            message: 'Chỉ chấp nhận JPG, PNG, WEBP',
          }
        ),
      z.string(),
      z.null(),
    ])
    .optional(),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

// Category form
export const categoryFormSchema = z.object({
  categoryName: z
    .string()
    .min(2, { message: 'Tên danh mục phải có ít nhất 2 ký tự' })
    .max(20, { message: 'Tên danh mục không được vượt quá 20 ký tự' }),
  description: z
    .string()
    .max(500, { message: 'Mô tả không được vượt quá 500 ký tự' })
    .optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// Store form
export const storeFormSchema = z.object({
  storeName: z.string().min(1, { message: 'Tên cửa hàng không được để trống' }),
  address: z.string().min(1, { message: 'Địa chỉ không được để trống' }),
  mainImageFile: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: 'File phải nhỏ hơn 5MB',
        })
        .refine(
          (file) =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          {
            message: 'Chỉ chấp nhận JPG, PNG, WEBP',
          }
        ),
      z.string(),
      z.null(),
    ])
    .optional(),
  additionalImageFiles: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Mỗi file phải nhỏ hơn 5MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
              message: 'Chỉ chấp nhận JPG, PNG, WEBP',
            }
          ),
        z.string(),
      ])
    )
    .default([])
    .refine((files) => files.length <= 3, {
      message: 'Chỉ có thể tải lên tối đa 3 hình ảnh bổ sung',
    }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  type: z.string().optional(),
  zoneId: z.string().optional(),
});

export type StoreFormValues = z.infer<typeof storeFormSchema>;

// Publisher form
export const publisherFormSchema = z.object({
  publisherName: z
    .string()
    .min(1, { message: 'Tên nhà xuất bản không được để trống' }),
  managerId: z.string().optional(),
  phone: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        return REGEX.PHONE_VN.test(val);
      },
      {
        message: 'Số điện thoại không hợp lệ',
      }
    )
    .optional(),
  email: z.string().email({ message: 'Email không hợp lệ' }).optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  website: z.string().optional(),
  mainImageFile: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: 'File phải nhỏ hơn 5MB',
        })
        .refine(
          (file) =>
            ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
          {
            message: 'Chỉ chấp nhận JPG, PNG, WEBP',
          }
        ),
      z.string(),
      z.null(),
    ])
    .optional(),
  additionalImageFiles: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 5 * 1024 * 1024, {
            message: 'Mỗi file phải nhỏ hơn 5MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
              message: 'Chỉ chấp nhận JPG, PNG, WEBP',
            }
          ),
        z.string(),
      ])
    )
    .default([])
    .refine((files) => files.length <= 3, {
      message: 'Chỉ có thể tải lên tối đa 3 hình ảnh bổ sung',
    }),
});

export type PublisherFormValues = z.infer<typeof publisherFormSchema>;

// User Store form
export const userStoreFormSchema = z
  .object({
    contractNumber: z.string().min(1, { message: 'Số hợp đồng là bắt buộc' }),
    startDate: z
      .string()
      .refine((val) => dayjs(val).isValid(), {
        message: 'Ngày giờ bắt đầu không hợp lệ',
      })
      .nullable(),
    endDate: z
      .string()
      .refine((val) => dayjs(val).isValid(), {
        message: 'Ngày giờ kết thúc không hợp lệ',
      })
      .nullable(),
    status: z.nativeEnum(StoreRent),
    contractFile: z
      .instanceof(File, { message: 'Vui lòng chọn file hợp đồng' })
      .refine((file) => file.size > 0, { message: 'File không được rỗng' })
      .refine(
        (file) =>
          ['application/pdf', 'image/jpeg', 'image/png'].includes(file.type),
        { message: 'Chỉ chấp nhận file PDF, JPEG hoặc PNG' }
      ),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate) {
      if (!dayjs(data.endDate).isAfter(dayjs(data.startDate))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Ngày kết thúc phải sau ngày bắt đầu',
          path: ['endDate'],
        });
      }
    }
  });

export type UserStoreFormValues = z.infer<typeof userStoreFormSchema>;

export const dailyPopulationSchema = z.object({
  date: z.string().date(),
  male: z.number().optional(),
  female: z.number().optional(),
  total: z.number().optional(),
});

export type DailyPopulationStatistics = z.infer<typeof dailyPopulationSchema>;

export const eventFormSchema = z
  .object({
    eventName: z
      .string()
      .min(1, { message: 'Tên sự kiện không được để trống' }),
    description: z.string().min(10, {
      message: 'Vui lòng viết nội dung chi tiết ',
    }),
    baseImgFile: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 10 * 1024 * 1024, {
            message: 'Ảnh chính phải nhỏ hơn 10MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
              message: 'Chỉ chấp nhận JPG, PNG, WEBP chất lượng cao',
            }
          ),
        z.string().min(1, {
          message: 'Vui lòng tải lên ảnh chính',
        }),
      ])
      .optional(),
    otherImgFile: z
      .array(
        z.union([
          z
            .instanceof(File)
            .refine((file) => file.size <= 8 * 1024 * 1024, {
              message: 'Mỗi ảnh bổ sung phải nhỏ hơn 8MB',
            })
            .refine(
              (file) =>
                ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
              {
                message: 'Chỉ chấp nhận JPG, PNG, WEBP chất lượng cao',
              }
            ),
          z.string(),
        ])
      )
      .default([])
      .refine((files) => files.length <= 10, {
        message: 'Chỉ có thể tải lên tối đa 10 ảnh bổ sung',
      }),
    videoFile: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 50 * 1024 * 1024, {
            message: 'Video phải nhỏ hơn 50MB',
          })
          .refine(
            (file) =>
              ['video/mp4', 'video/webm', 'video/quicktime'].includes(
                file.type
              ),
            {
              message: 'Chỉ chấp nhận video định dạng MP4, WebM hoặc QuickTime',
            }
          )
          .superRefine(async (file, ctx) => {
            try {
              const url = URL.createObjectURL(file);
              const video = document.createElement('video');

              await new Promise<void>((resolve, reject) => {
                video.onloadedmetadata = () => {
                  URL.revokeObjectURL(url);
                  if (video.videoWidth < 1280 || video.videoHeight < 720) {
                    ctx.addIssue({
                      code: z.ZodIssueCode.custom,
                      message:
                        'Video phải có độ phân giải tối thiểu 720p (1280x720)',
                    });
                  }
                  resolve();
                };
                video.onerror = () =>
                  reject(new Error('Failed to load video metadata'));
                video.src = url;
              });
            } catch {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Không thể xác định chất lượng video',
              });
            }
          }),
        z.string(),
        z.null(),
      ])
      .optional(),
    isOpen: z.boolean().optional().default(false),
    allowAds: z.boolean().optional().default(false),
    zoneId: z.string().min(1, {
      message: 'Vui lòng chọn khu vực tổ chức sự kiện',
    }),
    eventDates: z.array(z.string().date('Ngày không hợp lệ')),
    startTimes: z.array(
      z.string().time({
        message: 'Giờ bắt đầu không hợp lệ',
      })
    ),
    endTimes: z.array(
      z.string().time({
        message: 'Giờ kết thúc không hợp lệ',
      })
    ),
  })
  .refine(
    (data) => {
      // Validate that we have at least one date/time set
      if (
        !data.eventDates?.length ||
        !data.startTimes?.length ||
        !data.endTimes?.length
      ) {
        return false;
      }

      // Validate that arrays have same length
      if (
        data.eventDates.length !== data.startTimes.length ||
        data.eventDates.length !== data.endTimes.length
      ) {
        return false;
      }

      return true;
    },
    {
      message: 'Cần có ít nhất một ngày và thời gian hoàn chỉnh',
      path: ['eventDates'],
    }
  )
  .refine(
    (data) => {
      // Validate that end times are after start times with minimum 30 minutes
      for (let i = 0; i < (data.startTimes?.length || 0); i++) {
        const startTime = data.startTimes?.[i];
        const endTime = data.endTimes?.[i];

        if (startTime && endTime) {
          const start = new Date(`1970-01-01T${startTime}:00`);
          const end = new Date(`1970-01-01T${endTime}:00`);

          if (end <= start) {
            return false;
          }

          // Check minimum 30 minutes difference
          const diff = end.getTime() - start.getTime();
          if (diff < 30 * 60 * 1000) {
            // 30 minutes in milliseconds
            return false;
          }
        }
      }
      return true;
    },
    {
      message: 'Thời gian kết thúc phải sau thời gian bắt đầu ít nhất 30 phút',
      path: ['endTimes'],
    }
  )
  .refine(
    (data) => {
      // Validate that event dates are not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (const dateStr of data.eventDates || []) {
        const eventDate = new Date(dateStr);
        if (eventDate < today) {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Ngày sự kiện không được là ngày trong quá khứ',
      path: ['eventDates'],
    }
  );

export type EventFormValues = z.infer<typeof eventFormSchema>;

export const userFormSchema = z
  .object({
    userName: z
      .string()
      .min(1, { message: 'Tên đăng nhập không được để trống' }),
    email: z
      .string()
      .min(1, { message: 'Email không được để trống' })
      .email({ message: 'Email không hợp lệ' }),
    password: z
      .string()
      .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
      .max(32, { message: 'Mật khẩu không được quá 32 kí tự' })
      .regex(/[A-Z]/, { message: 'Mật khẩu cần ít nhất 1 chữ hoa' })
      .regex(/[a-z]/, { message: 'Mật khẩu cần ít nhất 1 chữ thường' })
      .regex(/[0-9]/, { message: 'Mật khẩu cần ít nhất 1 số' })
      .regex(/[^A-Za-z0-9]/, {
        message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt',
      })
      .default('User@12345'),
    fullName: z.string().optional(),
    phone: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          return REGEX.PHONE_VN.test(val);
        },
        {
          message: 'Số điện thoại không hợp lệ',
        }
      )
      .optional(),
    dob: z
      .string()
      .refine(
        (val) => {
          if (!val) return true;
          const birthDate = new Date(val);
          const today = new Date();

          // Calculate age
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();

          // Adjust age if birthday hasn't occurred yet this year
          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ) {
            age--;
          }

          return age >= 18;
        },
        {
          message: 'Người dùng phải từ 18 tuổi trở lên',
        }
      )
      .optional()
      .nullable(),
    address: z.string().optional(),
    gender: z.nativeEnum(Gender).optional(),
    requestedRoleId: z.string({
      required_error: 'Vui lòng chọn vai trò cho người dùng',
      invalid_type_error: 'Vai trò không hợp lệ',
    }),
    mainImageFile: z
      .union([
        z
          .instanceof(File)
          .refine((file) => file.size <= 2 * 1024 * 1024, {
            message: 'File phải nhỏ hơn 2MB',
          })
          .refine(
            (file) =>
              ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
            {
              message: 'Chỉ chấp nhận JPG, PNG, WEBP',
            }
          ),
        z.string(),
        z.null(),
      ])
      .optional(),
    additionalImageFiles: z
      .array(
        z.union([
          z
            .instanceof(File)
            .refine((file) => file.size <= 2 * 1024 * 1024, {
              message: 'Mỗi file phải nhỏ hơn 2MB',
            })
            .refine(
              (file) =>
                ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
              {
                message: 'Chỉ chấp nhận JPG, PNG, WEBP',
              }
            ),
          z.string(),
        ])
      )
      .default([])
      .refine((files) => files.length <= 3, {
        message: 'Chỉ có thể tải lên tối đa 3 hình ảnh bổ sung',
      }),
  })
  .refine((data) => !/[^\x00-\x7F]/.test(data.password), {
    message: 'Mật khẩu không được chứa emoji hoặc ký tự không hợp lệ',
    path: ['password'],
  });

export type UserFormValues = z.infer<typeof userFormSchema>;

// Souvenir form
export const souvenirFormSchema = z.object({
  souvenirName: z
    .string()
    .min(1, { message: 'Tên quà lưu niệm không được để trống' }),
  price: z.number().min(1000, { message: 'Số tiền không hợp lệ' }),
  description: z.string().optional(),
  baseImgFile: z.union([
    z
      .instanceof(File, { message: 'Vui lòng tải lên ảnh chính' })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File phải nhỏ hơn 5MB',
      })
      .refine(
        (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
        {
          message: 'Chỉ chấp nhận JPG, PNG, WEBP',
        }
      ),
    z.string().nonempty({
      message: 'Vui lòng tải lên ảnh chính',
    }),
  ]),
});

export type SouvenirFormValues = z.infer<typeof souvenirFormSchema>;

// Zone form
export const zoneFormSchema = z.object({
  zoneName: z.string().min(1, { message: 'Vui lòng nhập tên khu vực' }),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type ZoneFormSchema = z.infer<typeof zoneFormSchema>;

// Street form
export const streetFormSchema = z.object({
  streetName: z.string().min(1, 'Tên đường là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  description: z
    .string()
    .min(1, 'Mô tả là bắt buộc')
    .min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  latitude: z.number(),
  longitude: z.number(),
  baseImgFile: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => {
      if (!file) return true; // Optional field
      return file.size <= MAX_BASE_IMAGE_SIZE;
    }, 'Ảnh chính không được vượt quá 10MB')
    .refine((file) => {
      if (!file) return true; // Optional field
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, 'Ảnh chính chỉ chấp nhận định dạng JPEG, PNG, WebP'),
  otherImgFiles: z
    .array(z.instanceof(File))
    .optional()
    .default([])
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => file.size <= MAX_OTHER_IMAGE_SIZE);
    }, 'Mỗi ảnh khác không được vượt quá 5MB')
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file.type));
    }, 'Ảnh khác chỉ chấp nhận định dạng JPEG, PNG, WebP')
    .refine((files) => {
      if (!files) return true;
      return files.length <= 10; // Giới hạn số lượng ảnh khác
    }, 'Chỉ được tải lên tối đa 10 ảnh khác'),
});

export type StreetFormValues = z.infer<typeof streetFormSchema>;
