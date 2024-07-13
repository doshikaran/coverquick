import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const useSignup = () => {
  const { isLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const saveUserToDatabase = async () => {
      if (isLoaded && user) {
        const { id, emailAddresses, firstName, lastName } = user;

        try {
          await prisma.user.create({
            data: {
              clerkId: id,
              email: emailAddresses[0].emailAddress,
              firstName,
              lastName,
            },
          });

          console.log("User created in database:", id);
        } catch (error) {
          console.error("Error saving user to database:", error);
        }

        router.push("/dashboard");
      }
    };

    saveUserToDatabase();
  }, [isLoaded, user, router]);
};

export default useSignup;
