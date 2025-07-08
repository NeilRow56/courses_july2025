import { buttonVariants } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AuthLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
      <Link
        href='/'
        className={buttonVariants({
          variant: 'outline',
          className: 'absolute top-4 left-4'
        })}
      >
        <ArrowLeft /> Back
      </Link>
      <div className='w-full max-w-sm md:max-w-3xl'>{children}</div>
    </div>
  )
}
