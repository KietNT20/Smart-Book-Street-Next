import { REGEX } from '@/constant/regex';
import { Roles } from '@/constant/roles';
import * as z from 'zod';

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginSchema = z.object({
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
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerSchema = z.object({
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
  fullname: z.string().min(1, { message: 'Vui lòng nhập tên' }),
  role: z.enum([Roles.BRAND_MANAGER, Roles.STORE_MANAGER]),
});
