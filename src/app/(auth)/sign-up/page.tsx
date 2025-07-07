import { auth } from '@/lib/auth'
import { SignUpView } from '@/modules/auth/ui/views/sign-up-view'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const SignupPage = async () => {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })

  if (!!session) redirect('/')
  return <SignUpView />
}

export default SignupPage
