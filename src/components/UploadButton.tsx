// 'use client';
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Cloud } from "lucide-react";
// import Link from "next/link";

// interface ResumeUploadProps {
//   id: string;
// }

// const ResumeUpload: React.FC<ResumeUploadProps> = ({ id }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [resumeUrl, setResumeUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const storedResumeUrl = localStorage.getItem('resumeUrl');
//     if (storedResumeUrl) {
//       setResumeUrl(storedResumeUrl);
//       setMessage("Resume uploaded successfully!");
//     }
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFile(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!file) return;
//     setUploading(true);
//     setMessage("");
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("id", id);
//     try {
//       const response = await axios.post("/api/uploadresume", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setMessage("Resume uploaded successfully!");
//       console.log("Upload successful:", response.data);
//       const resumeUrl = response.data.resumeUrl;
//       setResumeUrl(resumeUrl);
//       localStorage.setItem('resumeUrl', resumeUrl);
//     } catch (error) {
//       setMessage("Upload failed. Please try again.");
//       console.error("Upload failed:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="p-10 flex">
//       <div className="w-1/2">
//         <h1 className="text-xl font-medium tracking-widest">Upload your Resume</h1>
//         <form onSubmit={handleSubmit} className="mt-10">
//           <div className="border h-60 rounded-lg border-dashed border-gray-300 mr-10">
//             <div className="flex items-center justify-center h-full w-full">
//               {!resumeUrl ? (
//                 <label
//                   htmlFor="dropzone-file"
//                   className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                 >
//                   <div className="flex flex-col items-center justify-center pt-5 pb-5">
//                     <Cloud className="h-5 w-5 text-green-500 mb-3" />
//                     <p className="text-sm mb-3 text-zinc-700">
//                       <span className="tracking-widest font-bold underline">
//                         Click here to select your file
//                       </span>
//                     </p>
//                   </div>
//                   <input
//                     id="dropzone-file"
//                     type="file"
//                     onChange={handleFileChange}
//                     accept=".pdf"
//                     className="hidden"
//                   />
//                 </label>
//               ) : (
//                 <div className="flex flex-col items-center justify-center w-full h-full">
//                   <p className="text-green-500">Resume uploaded successfully!</p>
//                 </div>
//               )}
//             </div>
//           </div>
//           {!resumeUrl && (
//             <button
//               type="submit"
//               disabled={!file || uploading}
//               className="mt-5 bg-black text-white py-2 px-4 rounded disabled:opacity-50 uppercase tracking-widest text-sm"
//             >
//               {uploading ? "Uploading..." : "Upload"}
//             </button>
//           )}
//           {message && <p className="mt-3 text-green-500">{message}</p>}
//         </form>
//       </div>

//       <div className="w-1/2 pl-5">
//         {resumeUrl ? (
//           <div>
//             <h2 className="text-xl font-medium tracking-widest">Your Uploaded Resume</h2>
//             <iframe
//               src={resumeUrl}
//               className="w-full h-[700px] mt-5 border border-gray-300 rounded-lg"
//             ></iframe>
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center uppercase tracking-widest text-xs font-medium">No resume uploaded yet.</p>
//         )}
//       </div>
      
//       {resumeUrl && (
//         <Link href="/generatecover">
//           <h1 className="fixed bottom-10 right-10 bg-black text-white py-3 px-6 rounded-lg shadow-lg transition-colors duration-300">
//             Generate Cover
//           </h1>
//         </Link>
//       )}
//     </div>
//   );
// };

// export default ResumeUpload;


'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Cloud } from "lucide-react";
import Link from "next/link";

interface ResumeUploadProps {
  id: string;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ id }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const checkResumeExists = async () => {
      const storedResumeUrl = localStorage.getItem('resumeUrl');
      if (storedResumeUrl) {
        try {
          const response = await axios.get(`/api/checkresume?clerkId=${id}`);
          if (response.data.exists) {
            setResumeUrl(storedResumeUrl);
            setMessage("Resume uploaded successfully!");
          } else {
            localStorage.removeItem('resumeUrl');
          }
        } catch (error) {
          console.error("Error checking resume existence:", error);
        }
      }
    };

    checkResumeExists();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);
    try {
      const response = await axios.post("/api/uploadresume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Resume uploaded successfully!");
      console.log("Upload successful:", response.data);
      const resumeUrl = response.data.resumeUrl;
      setResumeUrl(resumeUrl);
      localStorage.setItem('resumeUrl', resumeUrl);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10 flex">
      <div className="w-1/2">
        <h1 className="text-xl font-medium tracking-widest">Upload your Resume</h1>
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="border h-60 rounded-lg border-dashed border-gray-300 mr-10">
            <div className="flex items-center justify-center h-full w-full">
              {!resumeUrl ? (
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-5">
                    <Cloud className="h-5 w-5 text-green-500 mb-3" />
                    <p className="text-sm mb-3 text-zinc-700">
                      <span className="tracking-widest font-bold underline">
                        Click here to select your file
                      </span>
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <p className="text-green-500">Resume uploaded successfully!</p>
                </div>
              )}
            </div>
          </div>
          {!resumeUrl && (
            <button
              type="submit"
              disabled={!file || uploading}
              className="mt-5 bg-black text-white py-2 px-4 rounded disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
          {message && <p className="mt-3 text-green-500">{message}</p>}
        </form>
      </div>

      <div className="w-1/2 pl-5">
        {resumeUrl ? (
          <div>
            <h2 className="text-xl font-medium tracking-widest">Your Uploaded Resume</h2>
            <iframe
              src={resumeUrl}
              className="w-full h-[700px] mt-5 border border-gray-300 rounded-lg"
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-500 text-center uppercase tracking-widest text-xs font-medium">No resume uploaded yet.</p>
        )}
      </div>
      
      {resumeUrl && (
        <Link href="/generatecover">
          <h1 className="fixed bottom-10 right-10 bg-black text-white py-3 px-6 rounded-lg shadow-lg transition-colors duration-300">
            Generate Cover
          </h1>
        </Link>
      )}
    </div>
  );
};

export default ResumeUpload;
