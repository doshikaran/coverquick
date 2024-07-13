// import JobDescription from "@/components/JobDescription";
// import { Button } from "@/components/ui/button";
// import { MoveLeftIcon } from "lucide-react";
// import Link from "next/link";
// import React from "react";

// type Props = {};

// const GenerateCover = (props: Props) => {
//   return (
//     <div className="w-full h-screen bg-white p-10 flex">
//       {/* left side */}
//       <div className="w-1/2">
//         {/* button back */}
//         <div>
//           <Button className="bg-black text-white uppercase tracking-widest text-xs">
//             <MoveLeftIcon className="h-5 w-3 mr-2" />
//             <Link href={"/uploadresume"}>Back</Link>
//           </Button>
//         </div>

//         {/* job description */}
//         <div>
//           <JobDescription />
//         </div>
//       </div>

//       {/* right side */}
//     </div>
//   );
// };

// export default GenerateCover;

import JobDescription from "@/components/JobDescription";
import { Button } from "@/components/ui/button";
import { MoveLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const GenerateCover = (props: Props) => {
  return (
    <div className="w-full h-full bg-white p-10 flex">
      {/* left side */}
      <div className="w-full">
        {/* button back */}
        <div className="mb-5">
          <Button className="bg-black text-white uppercase tracking-widest text-xs">
            <MoveLeftIcon className="h-5 w-3 mr-2" />
            <Link href={"/uploadresume"}>Back</Link>
          </Button>
        </div>

        {/* job description */}
        <div>
          <JobDescription />
        </div>
      </div>
    </div>
  );
};

export default GenerateCover;
