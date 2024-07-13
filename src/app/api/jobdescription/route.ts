// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient, Prisma } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   try {
//     const { description, clerkId } = await request.json();
//     console.log('Received data:', { description, clerkId });

//     if (!description) {
//       console.log('No description provided');
//       return NextResponse.json({ error: 'No description provided' }, { status: 400 });
//     }
//     if (!clerkId) {
//       console.log('No clerkId provided');
//       return NextResponse.json({ error: 'No clerkId provided' }, { status: 400 });
//     }

//     // Check if user exists
//     const user = await prisma.user.findUnique({
//       where: {
//         clerkId: clerkId,
//       },
//     });

//     if (!user) {
//       console.log(`User with clerkId ${clerkId} does not exist`);
//       return NextResponse.json({ error: `User with clerkId ${clerkId} does not exist` }, { status: 400 });
//     }

//     // Save job description to database
//     const jobDescription = await prisma.jobDescription.create({
//       data: {
//         userId: user.id,
//         description,
//       },
//     });

//     console.log('Job description saved to database:', jobDescription);

//     return NextResponse.json({ message: 'Job description saved successfully', jobDescription });
//   } catch (error) {
//     console.error('Error saving job description:', error);
//     let errorMessage = 'Internal server error';
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       // Check for known Prisma errors
//       errorMessage = `Prisma error: ${error.message}`;
//     } 
//     return NextResponse.json({ error: errorMessage }, { status: 500 });
//   }
// }

// coverlettergenerate/src/app/api/jobdescription/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const clerkId = request.nextUrl.searchParams.get('clerkId');

  if (!clerkId) {
    return NextResponse.json({ error: 'No clerkId provided' }, { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { jobDescriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const jobDescription = user.jobDescriptions[0] || null;
    return NextResponse.json({ jobDescription });
  } catch (error) {
    console.error('Error fetching job description:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { description, clerkId } = await request.json();
    if (!description) {
      return NextResponse.json({ error: 'No description provided' }, { status: 400 });
    }
    if (!clerkId) {
      return NextResponse.json({ error: 'No clerkId provided' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { jobDescriptions: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      return NextResponse.json({ error: `User with clerkId ${clerkId} does not exist` }, { status: 400 });
    }

    let jobDescription;
    let message;

    if (user.jobDescriptions.length > 0 && user.jobDescriptions[0].description === description) {
      jobDescription = user.jobDescriptions[0];
      message = 'Job description is up to date';
    } else {
      jobDescription = await prisma.jobDescription.create({
        data: {
          userId: user.id,
          description,
        },
      });
      message = 'Job description saved successfully';
    }

    return NextResponse.json({ message, jobDescription });
  } catch (error) {
    console.error('Error saving job description:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}