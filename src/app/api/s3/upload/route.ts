import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { z } from 'zod/v4'
import { S3 } from '@/lib/S3Client'
import { env } from 'process'

const fileUploadSchema = z.object({
  filename: z.string().min(1, { error: 'Filename is required' }),
  contentType: z.string().min(1, { error: 'Content type is required' }),
  size: z.number().min(1, { error: 'File size is required' }),
  isImage: z.boolean()
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = fileUploadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { filename, contentType, size } = validation.data

    const uniqueKey = `${uuidv4()}-${filename}`

    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size
    })

    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 360 // URL expires in 6 minutes
    })

    const response = {
      presignedUrl,
      key: uniqueKey
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
}
