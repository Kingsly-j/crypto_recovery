"use client";
import React, { useState } from "react";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch {
      alert("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  }

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

        <div className="w-full flex flex-col max-w-[80%] sm:max-w-lg md:max-w-lg lg:max-w-xl bg-[#0E111C]/85 rounded-lg items-center justify-center">
          <p className="text-white text-lg md:text-xl font-bold p-3">
            Admin Login
          </p>

          <form
            onSubmit={handleLogin}
            className="flex flex-col max-w-xs gap-6 p-6 rounded-xl bg-[#0E111C] shadow-xl"
          >
            <p className="text-white text-left">
              Sign in to access the admin panel
            </p>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 text-left">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full rounded-lg bg-[#151A2E] p-3 text-white placeholder-[#5A6278] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-400 text-left">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-[#151A2E] p-3 text-white placeholder-[#5A6278] focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-500 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
