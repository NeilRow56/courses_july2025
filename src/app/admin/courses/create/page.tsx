import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { CourseCreationForm } from '@/modules/courses/components/course-creation-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function CreateCoursePage() {
  return (
    <>
      <div className='mb-8 flex items-center gap-4'>
        <Link
          href='/admin/courses'
          className={buttonVariants({
            variant: 'outline',
            size: 'icon'
          })}
        >
          <ArrowLeft className='size-4' />
        </Link>
        <h1 className='text-2xl font-bold'>Create Courses</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-primary text-2xl'>
            Basic Information
          </CardTitle>
          <CardDescription>
            Please provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourseCreationForm />
        </CardContent>
      </Card>
    </>
  )
}
