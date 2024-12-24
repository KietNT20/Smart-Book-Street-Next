import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email" })
    .email({ message: "Email không hợp lệ" }),
  password: z
    .string()
    .min(8, { message: "Mật khẩu cần ít nhất 8 kí tự" })
    .regex(/[A-Z]/, {
      message: "Mật khẩu cần ít nhất 1 chữ hoa",
    })
    .regex(/[a-z]/, {
      message: "Mật khẩu cần ít nhất 1 chữ thường",
    })
    .regex(/[0-9]/, {
      message: "Mật khẩu cần ít nhất 1 số",
    })
    .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/]/, {
      message: "Mật khẩu cần ít nhất 1 kí tự đặc biệt",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
