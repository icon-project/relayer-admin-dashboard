'use server'

import { z } from '@/zod/zod';

const schema = z.object({
  height: z
    .number()
    .min(1),
  chain: z
    .string()
    .trim()
    .min(1),
})

type FormState = {
  success: boolean;
  message: string;
  validated: boolean;
  formKey: number;
  errors?: {
    [key in keyof typeof schema.shape]?: string[];
  };
}

export default async function relay(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = schema.safeParse({
    chain: formData.get('chain'),
    height: formData.get('height'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      success: false,
      validated: false,
      formKey: prevState.formKey,
      message: 'Validation error',
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mock error.
  if (validatedFields.data.chain === 'error') {
    return {
      success: false,
      validated: true,
      formKey: prevState.formKey,
      message: 'Unexpected error occurred. Please try again.',
    }
  }

  // Implement real add new record logic.

  return {
    success: true,
    validated: true,
    formKey: prevState.formKey + 1,
    message: 'Record saved successfully.',
  }
}
