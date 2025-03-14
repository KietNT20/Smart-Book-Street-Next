import { REGEX } from '@/constant/regex';
import { Gender } from '@/enums/gender-enums';
import * as z from 'zod';

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
        message: 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ'
      }
    ),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' })
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

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
      message: 'Mật khẩu cần ít nhất 1 chữ hoa'
    })
    .regex(/[a-z]/, {
      message: 'Mật khẩu cần ít nhất 1 chữ thường'
    })
    .regex(/[0-9]/, {
      message: 'Mật khẩu cần ít nhất 1 số'
    })
    .regex(REGEX.SPECIAL_CHAR, {
      message: 'Mật khẩu cần ít nhất 1 kí tự đặc biệt'
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
        message: 'Số điện thoại không hợp lệ'
      }
    )
    .optional(),
  gender: z.enum([Gender.Male, Gender.Female]).optional()
});

export const bookSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, { message: 'Mã sách không được để trống' }),
  title: z.string().min(1, { message: 'Tên sách không được để trống' }),
  publicationDate: z
    .string()
    .min(1, { message: 'Vui lòng chọn ngày xuất bản' }),
  price: z.number().min(0, { message: 'Giá không được âm' }),
  languages: z.string().min(1, { message: 'Ngôn ngữ không được để trống' }),
  description: z.string().optional(),
  size: z.string().optional(),
  status: z.string().min(1, { message: 'Trạng thái không được để trống' }),
  publisherId: z
    .string()
    .min(1, { message: 'Nhà xuất bản không được để trống' }),
  authorIds: z
    .array(z.string())
    .min(1, { message: 'Tác giả không được để trống' }),
  categoryIds: z
    .array(z.string())
    .min(1, { message: 'Thể loại không được để trống' }),
  createdBy: z.string().optional(),
  createdDate: z.string().optional(),
  lastUpdatedBy: z.string().optional(),
  lastUpdatedDate: z.string().optional(),
  isDeleted: z.boolean().optional()
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
    endDate: z.string().optional()
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
      path: ['endDate']
    }
  );

export type SearchBookFormValues = z.infer<typeof searchBookSchema>;

export const authorFormSchema = z.object({
  authorName: z.string().min(1, 'Tên tác giả là bắt buộc'),
  dob: z.string().optional(),
  nationality: z.string().optional(),
  biography: z.string().optional()
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;
