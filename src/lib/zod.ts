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
        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a valid username (you can adjust these requirements)
        const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

        return emailRegex.test(value) || usernameRegex.test(value);
      },
      {
        message: 'Vui lòng nhập email hoặc tên đăng nhập hợp lệ',
      }
    ),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerSchema = z.object({
  userName: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
  email: z
    .string()
    .min(1, { message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu cần ít nhất 8 kí tự' })
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
  // dob: z.date().refine(
  //   (value) => {
  //     const now = new Date();
  //     return now.getFullYear() - value.getFullYear() >= 18;
  //   },
  //   { message: 'Tuổi phải lớn hơn hoặc bằng 18' }
  // ),
  dob: z.date(),
  address: z.string().min(1, { message: 'Vui lòng nhập địa chỉ' }),
  phone: z
    .string()
    .regex(REGEX.PHONE_VN, {
      message: 'Số điện thoại không hợp lệ',
    })
    .min(1, { message: 'Vui lòng nhập số điện thoại' }),
  gender: z.enum([Gender.Male, Gender.Female]),
  // roles: z.enum([UserRole.PUBLISHER_MANAGER, UserRole.STORE_MANAGER]),
});
