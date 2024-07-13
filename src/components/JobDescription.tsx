"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClipboard } from "react-icons/fa";

const JobDescription: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coverLetter, setCoverLetter] = useState<string>("");
  const { userId } = useAuth();

  useEffect(() => {
    const fetchJobDescription = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `/api/jobdescription?clerkId=${userId}`
          );
          if (response.data.jobDescription) {
            setJobDescription(response.data.jobDescription.description);
            localStorage.setItem(
              "jobDescription",
              response.data.jobDescription.description
            );
          }
        } catch (error) {
          console.error("Error fetching job description:", error);
        }
      }
    };

    fetchJobDescription();
  }, [userId]);

  useEffect(() => {
    const storedCoverLetter = localStorage.getItem("coverLetter");
    if (storedCoverLetter) {
      setCoverLetter(storedCoverLetter);
    }
  }, []);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
    localStorage.setItem("jobDescription", e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User is not authenticated.");
      return;
    }
    setIsLoading(true);
    try {
      const clerkId = userId;
      const response = await axios.post(
        "/api/jobdescription",
        { description: jobDescription, clerkId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to save job description. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!userId) {
      toast.error("User is not authenticated.");
      return;
    }
    setIsLoading(true);
    setCoverLetter("");
    try {
      const response = await axios.post(
        "/api/generatecoverletter",
        { clerkId: userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const generatedCoverLetter = response.data.coverLetter.content;
      setCoverLetter(generatedCoverLetter);
      localStorage.setItem("coverLetter", generatedCoverLetter);
      toast.success("Cover letter generated successfully!");
    } catch (error) {
      toast.error("Failed to generate cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(coverLetter)
      .then(() => {
        toast.success("Cover letter copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy cover letter. Please try again.");
      });
  };

  const handleDeleteCoverLetter = async () => {
    if (!userId) {
      toast.error("User is not authenticated.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.delete("/api/generatecoverletter", {
        data: { clerkId: userId },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        setCoverLetter("");
        localStorage.removeItem("coverLetter");
        toast.success("Cover letter deleted successfully.");
      } else {
        toast.error("Failed to delete cover letter. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row space-x-5 p-6 h-screen bg-gray-100">
      <ToastContainer />
      {/* Left side */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            value={jobDescription}
            onChange={handleDescriptionChange}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg mb-4 resize-none"
            placeholder="Paste the job description here..."
          />
           <button
            type="submit"
            className="bg-black text-white py-2 px-4 rounded-lg transition-colors duration-300 disabled:bg-gray-300"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>
        <div className="space-x-4 items-center justify-between">
         
          {jobDescription && (
            <Button
              onClick={handleGenerateCoverLetter}
              disabled={isLoading || coverLetter !== ""}
              className="mt-4 bg-black text-white py-2 px-4 rounded-lg  transition-colors duration-300"
            >
              {isLoading ? "Generating..." : "Generate Cover Letter"}
            </Button>
          )}
        </div>
      </div>

      {/* Right side */}
      {coverLetter && (
        <div className="flex-1">
          <h3 className="text-2xl font-semibold mb-4">
            Generated Cover Letter:
          </h3>
          <pre className="whitespace-pre-wrap border border-gray-300 rounded-lg p-4 h-96 overflow-y-auto mb-4">
            {coverLetter}
          </pre>
          <div className="flex mt-8 space-x-4 items-center justify-between">
            <Button
              onClick={handleCopyToClipboard}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center"
            >
              <FaClipboard className="" />
            </Button>
            <Button
              onClick={handleDeleteCoverLetter}
              className="bg-red-500 text-white py-2 px-4 rounded-lg text-xs transition-colors duration-300"
            >
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;
