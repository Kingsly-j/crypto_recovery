"use client";
import React from "react";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function InvalidLinkPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* SVG background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgStack />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4 backdrop-blur-sm bg-black/85">
        <div>
          <Image
            src={bgImage}
            alt="Background Image"
            className="absolute inset-0 -z-10 object-contain"
          />
        </div>
        <div className="w-full flex flex-col max-w-[80%] sm:max-w-lg md:max-w-lg lg:max-w-xl h-auto max-h-[80vh] md:max-h-[90vh] bg-[#0E111C]/85 rounded-lg items-center justify-center p-6">
          <p className="text-white text-lg md:text-xl flex font-bold gap-4 items-center mb-4">
            Link Invalid or Expired
          </p>

          <div className="flex flex-col gap-6 p-6 rounded-xl bg-[#151A2E] shadow-xl max-w-xs">
            <p className="text-white text-left">
              The link you are trying to access is either invalid, already used,
              or has expired.
            </p>
            <p className="text-gray-400 text-left">
              Please contact the admin to request a new access link.
            </p>

           
          </div>
        </div>
      </div>
    </main>
  );
}
