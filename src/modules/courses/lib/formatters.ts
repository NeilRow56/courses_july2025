import { CourseLevel, CourseStatus } from '@/db/schema'

export function formatCourseLevel(level: CourseLevel) {
  switch (level) {
    case 'beginner':
      return 'Beginner'
    case 'intermediate':
      return 'Intermediate'
    case 'advanced':
      return 'Advanced'
    default:
      throw new Error(`Invalid course level: ${level satisfies never}`)
  }
}
export function formatCourseStatus(status: CourseStatus) {
  switch (status) {
    case 'draft':
      return 'draft'
    case 'published':
      return 'Published'
    case 'archived':
      return 'Archived'
    default:
      throw new Error(`Invalid course status: ${status satisfies never}`)
  }
}
