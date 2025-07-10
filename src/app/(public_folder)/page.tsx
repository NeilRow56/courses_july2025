import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface featureProps {
  title: string
  description: string
  icon: string
}

const features: featureProps[] = [
  {
    title: 'Comprehensive Courses',
    description:
      'Access a wide range of carefully curated courses designed by industry experts',
    icon: '📚'
  },
  {
    title: 'Interactive Learning',
    description:
      'Engage with interactive content, quizes, and assignments to enhance your learning experience',
    icon: '🎮'
  },
  {
    title: 'Progress Tracking',
    description:
      'Monitor your progress and achievements with detailed analytics and personalized dashboards',
    icon: '📊'
  },
  {
    title: 'Community Support',
    description:
      'Join a vibrant community of learners and instructors to collaborate and share knowledge',
    icon: '👥'
  }
]

export default async function Home() {
  return (
    <>
      <section className='relative py-20'>
        <div className='flex flex-col items-center space-y-8 text-center'>
          <Badge variant='outline'>The Future of Online Education </Badge>
          <h1 className='text-4xl font-bold -tracking-tight md:text-6xl'>
            Elevate your learning experience
          </h1>
          <p className='text-muted-foreground max-w-[700px] md:text-xl'>
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime,
            anywhere.{' '}
          </p>
          <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
            <Link
              className={buttonVariants({
                size: 'lg'
              })}
              href='/courses'
            >
              Explore Courses
            </Link>
            <Link
              className={buttonVariants({
                size: 'lg',
                variant: 'outline'
              })}
              href='/sign-in'
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>
      <section className='mb-32 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {features.map(feature => (
          <Card
            key={feature.title}
            className='transition-shadow hover:shadow-lg'
          >
            <CardHeader>
              <div className='mb-4 text-4xl'>{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground'>{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  )
}
