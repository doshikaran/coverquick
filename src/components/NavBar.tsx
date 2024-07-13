// "use client";
// import Link from "next/link";
// import MaxWidthWrapper from "./MaxWidthWrapper";
// import { ArrowRight } from "lucide-react";
// import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";

// const NavBar = () => {
//   const { isLoaded, userId } = useAuth();
//   const user = userId;

//   return (
//     <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
//       <MaxWidthWrapper>
//         <div className="flex h-14 items-center justify-between border-b border-zinc-200">
//           <Link href="/" className="flex z-40 font-semibold">
//             <span className="font-extrabold uppercase text-sm tracking-widest">
//               CoverQuick
//             </span>
//           </Link>

//           <div className="hidden items-center space-x-5 sm:flex uppercase text-sm tracking-widest font-medium cursor-pointer">
//             {!user ? (
//               <>
//                 <SignInButton>
//                   <Link href="/uploadresume">
//                     <span className="flex items-center">
//                       Sign In <ArrowRight className="ml-1.5 h-4 w-4" />
//                     </span>
//                   </Link>
//                 </SignInButton>
//               </>
//             ) : (
//               <>
//                 <div className="flex gap-5 items-center">
//                   <UserButton />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </nav>
//   );
// };

// export default NavBar;

"use client";
import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { ArrowRight } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const NavBar = () => {
  const { isLoaded, userId } = useAuth();
  const user = userId;
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span className="font-extrabold uppercase text-sm tracking-widest">
              CoverQuick
            </span>
          </Link>

          <div className="hidden items-center justify-between space-x-5 sm:flex uppercase text-sm tracking-widest font-medium cursor-pointer">
            {!user ? (
              <>
                <SignInButton>Sign in</SignInButton>
                {/* <SignUpButton redirectUrl="/uploadresume">
                  <span className="flex items-center">
                    Register <ArrowRight className="ml-1.5 h-4 w-4" />
                  </span>
                </SignUpButton> */}
              </>
            ) : (
              <>
                <div className="flex gap-20 items-center">
                  {currentPath !== "/uploadresume" && (
                    <Link href="/uploadresume">Upload your Resume</Link>
                  )}
                  <UserButton />
                </div>
              </>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;
