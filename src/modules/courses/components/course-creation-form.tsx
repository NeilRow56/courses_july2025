'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import slugify from 'slugify'
import { courseSchema } from '../schema'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { SparkleIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { categories, courseLevels, courseStatuses } from '@/db/schema'
import { formatCourseLevel, formatCourseStatus } from '../lib/formatters'

export function CourseCreationForm() {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      description: '',
      fileKey: '',
      price: null,
      duration: null,
      level: 'beginner',
      category: 'Health & Fitness',
      status: 'draft',
      slug: '',
      smallDescription: ''
    }
  })

  function onSubmit(data: z.infer<typeof courseSchema>) {
    console.log(data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Title</FormLabel>
              <FormControl>
                <Input placeholder='e.g. Course Title' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-end gap-4'>
          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel className='font-semibold'>Slug</FormLabel>
                <FormControl>
                  <Input placeholder='Slug' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='button'
            className='w-fit'
            onClick={() => {
              const titleValue = form.getValues('title')

              const slug = slugify(titleValue)
              form.setValue('slug', slug, { shouldValidate: true })
            }}
          >
            Generate Slug <SparkleIcon className='ml-1' size={16} />
          </Button>
        </div>
        <FormField
          control={form.control}
          name='smallDescription'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='font-semibold'>Small description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Brief description of your course'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='font-semibold'>Description</FormLabel>
              <FormControl>
                <Textarea
                  className='min-h-[120px]'
                  placeholder='Full description of your course'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='fileKey'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel className='font-semibold'>Thummbnail image</FormLabel>
              <FormControl>
                <Input placeholder='Thummbnail url' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            name='category'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Category</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={val => field.onChange(val ?? null)}
                >
                  <FormControl>
                    <SelectTrigger className='rounded-l-none'>
                      <SelectValue placeholder='Select Category' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name='level'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Course level</FormLabel>
                <Select
                  value={field.value ?? ''}
                  onValueChange={val => field.onChange(val ?? null)}
                >
                  <FormControl>
                    <SelectTrigger className='rounded-l-none'>
                      <SelectValue placeholder='Select Level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {formatCourseLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>Price (£)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    value={field.value ?? ''}
                    className='rounded-r-none'
                    onChange={e =>
                      field.onChange(
                        isNaN(e.target.valueAsNumber)
                          ? null
                          : e.target.valueAsNumber
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='duration'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-semibold'>
                  Duration (hours)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='number'
                    value={field.value ?? ''}
                    className='rounded-r-none'
                    onChange={e =>
                      field.onChange(
                        isNaN(e.target.valueAsNumber)
                          ? null
                          : e.target.valueAsNumber
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name='status'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Status</FormLabel>
              <Select
                value={field.value ?? ''}
                onValueChange={val => field.onChange(val ?? null)}
              >
                <FormControl>
                  <SelectTrigger className='w-full rounded-l-none'>
                    <SelectValue placeholder='Select status' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {formatCourseStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
