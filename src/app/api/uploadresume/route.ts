// import { NextRequest, NextResponse } from 'next/server';
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   },
// });

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get('file') as File;
//     const userId = formData.get('userId') as string;

//     if (!file) {
//       return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//     }

//     const buffer = await file.arrayBuffer();
//     const filename = `${Date.now()}-${file.name}`;

//     // Upload to S3
//     const putObjectParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: filename,
//       Body: Buffer.from(buffer),
//       ContentType: file.type,
//     };

//     const command = new PutObjectCommand(putObjectParams);
//     const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

//     // Save to database
//     const objectKey = filename;
//     const resume = await prisma.resume.create({
//       data: {
//         userId,
//         filename,
//         url: objectKey,
//       },
//     });
//     const fullUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
//     return NextResponse.json({ message: 'File uploaded successfully', resumeUrl: fullUrl });
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const clerkId = formData.get('id') as string;
    console.log('Received form data:', { file, clerkId });

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!clerkId) {
      console.log('No clerkId provided');
      return NextResponse.json({ error: 'No clerkId provided' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });
    if (!user) {
      console.log(`User with clerkId ${clerkId} does not exist`);
      return NextResponse.json({ error: `User with clerkId ${clerkId} does not exist` }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer).toString('utf-8');
    const filename = `${Date.now()}-${file.name}`;

    // Upload to S3
    const putObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filename,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    };
    console.log('PutObjectParams:', putObjectParams);

    const command = new PutObjectCommand(putObjectParams);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    console.log('Signed URL:', signedUrl);

    await s3Client.send(command);
    console.log('File uploaded to S3:', filename);

    // Save to database
    const objectKey = filename;
    const resume = await prisma.resume.create({
      data: {
        userId: user.id,
        filename,
        url: objectKey,
        content,
      },
    });
    const fullUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;
    console.log('File saved to database:', resume);

    return NextResponse.json({ message: 'File uploaded successfully', resumeUrl: fullUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    let errorMessage = 'Internal server error';
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        errorMessage = 'Foreign key constraint failed. The specified id does not exist.';
      } else {
        errorMessage = `Prisma error: ${error.message}`;
      }
    } 
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
