'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { buttonVariants } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import Image from 'next/image'
import Link from 'next/link'
import { UserDropdown } from './user-dropdown'

interface navigationItemsProps {
  name: string
  href: string
}

const navigationItems: navigationItemsProps[] = [
  { name: 'Home', href: '/' },
  {
    name: 'Courses',
    href: '/courses'
  },
  {
    name: 'Dashboard',
    href: '/dashboard'
  }
]

export function Navbar() {
  const { data: session, isPending } = authClient.useSession()
  return (
    <header className='bg-background/95 backdrop-blur-[backdrop-filter]:bg-background sticky top-0 z-50 w-full border-b'>
      <div className='container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8'>
        <Link href='/' className='mr-4 flex items-center space-x-2'>
          <Image
            src={'/logo.png'}
            alt='logo'
            width={32}
            height={32}
            className='size-9'
          />
          <span className='font-bold'>MarshalLMS</span>
        </Link>
        {/* Desktop navigation */}
        <nav className='hidden md:flex md:flex-1 md:items-center md:justify-between'>
          <div className='flex items-center gap-2'>
            {navigationItems.map(item => (
              <Link
                className='hover:text-primary text-sm font-medium transition-colors'
                href={item.href}
                key={item.href}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className='flex items-center space-x-4'>
            <ModeToggle />
            {isPending ? null : session ? (
              <UserDropdown
                name={session.user.name}
                email={session.user.email}
                image={session.user.image || ''}
              />
            ) : (
              <>
                <Link
                  href='/sign-in'
                  className={buttonVariants({
                    variant: 'secondary'
                  })}
                >
                  Login
                </Link>
                <Link href='/sign-in' className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
