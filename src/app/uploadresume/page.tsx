"use client";
import ResumeUpload from "@/components/UploadButton";
import { useAuth } from "@clerk/nextjs";

export default function UploadResumePage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  // In a real application, you'd get the userId from your authentication system
  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <div className=" w-full h-screen bg-white">
      <ResumeUpload id={userId} />
    </div>
  );
}