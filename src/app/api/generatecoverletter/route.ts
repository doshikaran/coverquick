
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import OpenAI from 'openai';

// const prisma = new PrismaClient();
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST(request: NextRequest) {
//   try {
//     const { clerkId } = await request.json();

//     const user = await prisma.user.findUnique({
//       where: { clerkId },
//       include: { resumes: true, jobDescriptions: true },
//     });

//     if (!user || user.resumes.length === 0 || user.jobDescriptions.length === 0) {
//       return NextResponse.json({ error: 'Missing user data, resume, or job description' }, { status: 400 });
//     }

//     const latestResume = user.resumes[user.resumes.length - 1];
//     const latestJobDescription = user.jobDescriptions[user.jobDescriptions.length - 1];

//     const jobRole = latestJobDescription.description.split(' ').slice(0, 3).join(' ');
//     const companyNameRegex = /at\s+([A-Za-z\s]+)[.,]/;
//     const companyNameMatch = latestJobDescription.description.match(companyNameRegex);
//     const companyName = companyNameMatch ? companyNameMatch[1] : 'COMPANY_NAME';

//     const prompt = `You are an expert-level cover letter writing coach with over 10 years of experience getting candidates interviews at world-leading institutions. You are writing an expert-level cover letter for a high-quality candidate applying for a ${jobRole} job at ${companyName}. The total length of the cover letter should be 400 words.

//     Paragraph 1:
//     Start by expressing enthusiasm for a ${jobRole} job at ${companyName} and mention the cause of interest (type of work, company reputation, etc.). Flatter the company. Include the candidate's academic qualifications (Master of Applied Computing from University of Windsor). Mention how the candidate heard about the company. Continue by mentioning a specific project ${companyName} has been recognized for, demonstrating [top ranked skill from job description] skills. Form a parallel to the candidate’s organization skills by citing a relevant project they completed successfully. Ensure this paragraph is a maximum of 85 words.

//     Paragraph 2:
//     Showcase the candidate’s [top ranked skill from job description]. Provide an accomplishment/characteristic/skill/experience that makes the candidate uniquely qualified for the position and relates to the needs of the employer. Ensure this paragraph is a maximum of 85 words.

//     Paragraph 3:
//     Showcase the candidate’s [2nd ranked skill from job description]. Make this paragraph more personal by highlighting the candidate’s extracurricular activities and ethics. Mention specific extracurricular examples. Use the language, tone, and written style of the Harvard Competency Dictionary. Ensure this paragraph is a maximum of 85 words.

//     Paragraph 4:
//     Conclude with a simple and professional closing, expressing interest in an interview. This paragraph should be a maximum of 30 words. Include the candidate's phone number and email. End with "I look forward to meeting for an interview" before "Warm regards."

//     Resume data: ${JSON.stringify(latestResume)}
//     Job description: ${latestJobDescription.description}`;

//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const coverLetterContent = response.choices[0].message.content as string;

//     // Debugging logs
//     console.log("User ID:", user.id);
//     console.log("Cover Letter Content:", coverLetterContent);

//     if (!prisma.coverLetter) {
//       throw new Error("Prisma coverLetter model is not defined.");
//     }

//     const coverLetter = await prisma.coverLetter.create({
//       data: {
//         userId: user.id,
//         content: coverLetterContent,
//       },
//     });

//     return NextResponse.json({ coverLetter });
//   } catch (error) {
//     console.error('Error generating cover letter:', error);
//     return NextResponse.json({ error: error }, { status: 500 });
//   }
// }

// export async function DELETE(request: NextRequest) {
//   try {
//     const { clerkId } = await request.json();

//     const user = await prisma.user.findUnique({
//       where: { clerkId },
//     });

//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     await prisma.coverLetter.deleteMany({
//       where: { userId: user.id },
//     });

//     return NextResponse.json({ message: 'Cover letter deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting cover letter:', error);
//     return NextResponse.json({ error: 'Error deleting cover letter' }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { clerkId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { resumes: true, jobDescriptions: true },
    });

    if (!user || user.resumes.length === 0 || user.jobDescriptions.length === 0) {
      return NextResponse.json({ error: 'Missing user data, resume, or job description' }, { status: 400 });
    }

    const latestResume = user.resumes[user.resumes.length - 1];
    const latestJobDescription = user.jobDescriptions[user.jobDescriptions.length - 1];

    const jobRole = latestJobDescription.description.split(' ').slice(0, 3).join(' ');
    const companyNameRegex = /at\s+([A-Za-z\s]+)[.,]/;
    const companyNameMatch = latestJobDescription.description.match(companyNameRegex);
    const companyName = companyNameMatch ? companyNameMatch[1] : 'COMPANY_NAME';

    const skillsRegex = /skills required:\s*(.*)/i;
    const skillsMatch = latestJobDescription.description.match(skillsRegex);
    const skills = skillsMatch ? skillsMatch[1].split(',').map(skill => skill.trim()) : [];

    const educationRegex = /university of ([a-z\s]+)/i;
    const educationMatch = latestResume.content.match(educationRegex);
    const university = educationMatch ? educationMatch[1] : 'University';

    const prompt = `You are an expert-level cover letter writing coach with over 10 years of experience getting candidates interviews at world-leading institutions. You are writing an expert-level cover letter for a high-quality candidate applying for a ${jobRole} job at ${companyName}. The total length of the cover letter should be 600 words.

    Paragraph 1:
    Start by expressing enthusiasm for a ${jobRole} job at ${companyName} and mention the cause of interest (type of work, company reputation, etc.). Flatter the company. Include the candidate's academic qualifications (Master of Applied Computing from ${university}). Mention how the candidate heard about the company. Continue by mentioning a specific project ${companyName} has been recognized for, demonstrating ${skills[0]} skills. Form a parallel to the candidate’s organization skills by citing a relevant project they completed successfully. Ensure this paragraph sets a strong, engaging tone for the rest of the letter.

    Paragraph 2:
    Dive deeper into the candidate’s ${skills[0]} skills. Provide an accomplishment/characteristic/skill/experience that makes the candidate uniquely qualified for the position and relates to the needs of the employer. Use specific examples and quantify the impact where possible. This paragraph should showcase the candidate's technical proficiency and how they apply these skills in practical settings.

    Paragraph 3:
    Highlight the candidate’s ${skills[1]} skills. Make this paragraph more personal by showcasing the candidate’s passion for continuous learning and improvement. Mention specific examples of how the candidate has developed these skills through projects, extracurricular activities, or personal endeavors. Use the language, tone, and written style of the Harvard Competency Dictionary to describe these skills effectively.

    Paragraph 4:
    Discuss the candidate’s ${skills[2]} skills. Emphasize how these skills complement the primary skills and contribute to a well-rounded professional profile. Highlight any leadership experiences, teamwork, and collaboration efforts. Mention any additional skills or experiences that add value to the candidate's profile and align with the job requirements.

    Paragraph 5:
    Conclude with a simple and professional closing, expressing interest in an interview. Summarize the key points of the cover letter and reiterate the candidate's enthusiasm for the role at ${companyName}. Include the candidate's phone number and email. End with "I look forward to meeting for an interview" before "Warm regards."

    Resume data: ${JSON.stringify(latestResume)}
    Job description: ${latestJobDescription.description}`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const coverLetterContent = response.choices[0].message.content as string;

    // Debugging logs
    console.log("User ID:", user.id);
    console.log("Cover Letter Content:", coverLetterContent);

    if (!prisma.coverLetter) {
      throw new Error("Prisma coverLetter model is not defined.");
    }

    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: user.id,
        content: coverLetterContent,
      },
    });

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error('Error generating cover letter:', error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { clerkId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.coverLetter.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: 'Cover letter deleted successfully' });
  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return NextResponse.json({ error: 'Error deleting cover letter' }, { status: 500 });
  }
}
