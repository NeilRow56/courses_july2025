import { categories, courseLevels, courseStatuses } from '@/db/schema'
import * as z from 'zod/v4'

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { error: 'Title must be at least 3 characters.' })
    .max(100, { error: 'Title must be at most 100 characters.' }),
  description: z
    .string()
    .min(3, { error: 'Description must be at least 3 characters.' }),
  fileKey: z.string().min(1, { error: 'File is required' }),
  price: z
    .number()
    .min(1, { error: 'Price must be a positive number' })
    .nullable(),

  duration: z
    .number()
    .min(1, { error: 'Duration must be at least 1 hour' })
    .max(50, { error: 'Duration must be most least 50 hours' })
    .nullable(),

  level: z.enum(courseLevels, { error: 'Level is required' }).nullable(),
  //
  category: z.enum(categories, { error: 'Category is required' }),
  smallDescription: z
    .string()
    .min(3, { error: 'Small description must be at least 3 characters.' })
    .max(200, { error: 'Small description must be at most 200 characters.' }),
  slug: z.string().min(3, { error: 'Slug must be at least 3 characters.' }),
  status: z.enum(courseStatuses, { error: 'Status is required' })
})
