import { z } from 'zod';
import { POST_TYPES, CATEGORIES, ZONES } from './constants';

export const postSchema = z.object({
  type: z.enum(POST_TYPES, {
    errorMap: () => ({ message: 'Please select Lost or Found' }),
  }),
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(120, 'Title must not exceed 120 characters')
    .trim(),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .trim(),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Please select a category' }),
  }),
  zone: z.enum(ZONES, {
    errorMap: () => ({ message: 'Please select a campus zone' }),
  }),
  incidentDate: z.string()
    .min(1, 'Incident date is required')
    .refine((v) => new Date(v) <= new Date(), {
      message: 'Incident date cannot be in the future',
    }),
});

export default postSchema;
