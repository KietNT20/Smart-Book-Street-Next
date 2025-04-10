import { REGEX } from '@/constant/regex';
import { Gender } from '@/enums/gender';
import * as z from 'zod';

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
export const registerSchema = z.object({
  userName: z.string().min(1, { message: 'Vui lòng nghĩ tên đăng nhập' }),
  email: z
    .string()
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu cần ít nhất 8 kí tự' })
    .max(32, 'Mật khẩu không được quá 32 kí tự')
    .regex(/[A-Z]/, {
      message: 'Mật khẩu cần ít nhất 1 chữ hoa',
    })
    .regex(/[a-z]/, {
      message: 'Mật khẩu cần ít nhất 1 chữ thường',
    })
    .regex(/[0-9]/, {
      message: 'Mật khẩu cần ít nhất 1 số',
    })
    .regex(REGEX.SPECIAL_CHAR, {
      message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt',
    }),
  fullName: z.string().min(1, { message: 'Vui lòng nhập họ và tên' }),
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
  gender: z.enum([Gender.Male, Gender.Female]).optional(),
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
  code: z.string().min(1, { message: 'Mã sách không được để trống' }),
  title: z.string().min(1, { message: 'Tên sách không được để trống' }),
  publicationDate: bookPublishedDatedSchema,
  price: z.number().min(0, { message: 'Giá không được âm' }),
  languages: z.string().min(1, { message: 'Ngôn ngữ không được để trống' }),
  description: z.string().optional(),
  size: z.string().optional(),
  status: z.string().optional(),
  mainImageFile: z.instanceof(File).optional().or(z.string().optional()),
  additionalImageFiles: z.array(z.instanceof(File).or(z.string())).default([]),
  publisherId: z.string().optional(),
  authorIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  id: z.string().optional(),
});

export type BookFormValues = z.infer<typeof bookSchema>;

export const searchBookSchema = z
  .object({
    code: z.string().optional(),
    title: z.string().optional(),
    status: z.string().optional(),
    languages: z.string().optional(),
    price: z.number().min(0, { message: 'Giá không được âm' }).optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
      }
      return true;
    },
    {
      message: 'Ngày kết thúc phải sau ngày bắt đầu',
      path: ['endDate'],
    }
  );

export type SearchBookFormValues = z.infer<typeof searchBookSchema>;

// Author form
export const authorFormSchema = z.object({
  authorName: z.string().min(1, 'Tên tác giả là bắt buộc'),
  dob: z.string().date().optional(),
  nationality: z.string().optional(),
  biography: z.string().optional(),
  imgFile: z.instanceof(File).optional().or(z.string().optional()),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;

// Category form
export const categoryFormSchema = z.object({
  categoryName: z
    .string()
    .min(2, { message: 'Tên danh mục phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Tên danh mục không được vượt quá 50 ký tự' }),
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
  mainImageFile: z.instanceof(File).optional().or(z.string().optional()),
  additionalImageFiles: z.array(z.instanceof(File).or(z.string())).default([]),
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
  address: z.string().optional(),
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
  description: z.string().optional(),
  website: z.string().optional(),
  mainImageFile: z.instanceof(File).optional().or(z.string().optional()),
  additionalImageFiles: z.array(z.instanceof(File).or(z.string())).default([]),
});

export type PublisherFormValues = z.infer<typeof publisherFormSchema>;
