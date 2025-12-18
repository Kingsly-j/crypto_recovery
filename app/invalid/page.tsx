"use client";

import { useEffect } from "react";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function InvalidLinkPage() {
  useEffect(() => {
    // Push a fake state so back button has nowhere to go
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* SVG background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgStack />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4 backdrop-blur-sm bg-black/85">
        <Image
          src={bgImage}
          alt="Background Image"
          className="absolute inset-0 -z-10 object-contain"
        />

        <div className="w-full flex flex-col max-w-[80%] sm:max-w-lg lg:max-w-xl bg-[#0E111C]/85 rounded-lg items-center justify-center p-6">
          <p className="text-white text-lg md:text-xl font-bold mb-4">
            Link Invalid or Expired
          </p>

          <div className="flex flex-col gap-6 p-6 rounded-xl bg-[#151A2E] shadow-xl max-w-xs">
            <p className="text-white text-left">
              The link you are trying to access is either invalid, already used,
              or has expired.
            </p>
            <p className="text-gray-400 text-left">
              Please contact an agent to request a new access link.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
