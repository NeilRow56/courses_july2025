import { auth } from '@/lib/auth'
import { SignInView } from '@/modules/auth/ui/views/sign-in-view'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const SigninPage = async () => {
  const headersList = await headers()

  const session = await auth.api.getSession({
    headers: headersList
  })
  // if signed in redirect to home page
  if (!!session) redirect('/courses')
  return <SignInView />
}

export default SigninPage
