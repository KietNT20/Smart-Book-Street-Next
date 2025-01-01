'use server';

import { type LoginFormValues, loginSchema } from './schemas/schemas';

export async function loginUser(data: LoginFormValues) {
  const result = loginSchema.safeParse(data);
  if (!result.success) {
    throw new Error('Invalid form data');
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Failed to login');
  }
}
