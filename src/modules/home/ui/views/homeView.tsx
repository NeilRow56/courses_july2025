'use client'

import React from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export const HomeView = () => {
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
          <span
            // data-role={session.user.role}
            className='size-4 animate-pulse rounded-full data-[role=admin]:bg-red-600 data-[role=user]:bg-blue-600'
          />

          <span className='text-xl text-blue-600'>
            Welcome back, {session.user.name} 👋
          </span>
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
