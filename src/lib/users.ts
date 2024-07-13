import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

type CreateUserInput = {
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
export async function createUser(data: CreateUserInput) {
    try {
      const user = await prisma.user.create({ data })
      return { user }
    } catch (error) {
      return { error }
    }
  }
