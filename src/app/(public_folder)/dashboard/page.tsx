'use client'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  if (isPending) {
    return (
      <Button size='lg' className='opacity-50' asChild>
        <span>Get Started</span>
      </Button>
    )
  }
  const href = session ? '/dashboard' : '/sign-in'
  return (
    <div className='flex flex-col items-center gap-4'>
      <Button size='lg' asChild>
        <Link href={href}>Get Started</Link>
      </Button>
      {session && (
        <div className='flex items-center gap-2'>
          <span className='text-xl'>Welcome back, {session.user.name} 👋</span>
          <Button
            onClick={() =>
              authClient.signOut({
                fetchOptions: { onSuccess: () => router.push('/sign-in') }
              })
            }
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  )
}
