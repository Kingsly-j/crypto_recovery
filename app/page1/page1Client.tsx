"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import SvgStack from "@/components/SvgStack";
import Image from "next/image";
import bgImage from "@/components/Image_fx__2_-removebg-preview 1.svg";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Page1Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [valid, setValid] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [addresses, setAddresses] = useState<string[]>([""]);

  /* ---------------- VALIDATE TOKEN + PAGE ---------------- */
  useEffect(() => {
    if (!token) {
      router.replace("/invalid");
      return;
    }

    const init = async () => {
      try {
        const linkQuery = query(
          collection(db, "access_links"),
          where("urlId", "==", token)
        );
        const linkSnap = await getDocs(linkQuery);

        if (linkSnap.empty) {
          router.replace("/invalid");
          return;
        }

        const clientQuery = query(
          collection(db, "clients"),
          where("accessLinkId", "==", token)
        );
        const clientSnap = await getDocs(clientQuery);

        if (!clientSnap.empty) {
          const clientDoc = clientSnap.docs[0];
          const clientData = clientDoc.data();

          setClientId(clientDoc.id);

          if (clientData.currentPage && clientData.currentPage !== "page1") {
            router.replace(`/${clientData.currentPage}?token=${token}`);
            return;
          }
        }

        setValid(true);
      } catch (e) {
        console.error(e);
        router.replace("/invalid");
      }
    };

    init();
  }, [token, router]);

  /* ---------------- ADDRESS HELPERS ---------------- */
  const addAddress = () => setAddresses((p) => [...p, ""]);

  const updateAddress = (i: number, v: string) => {
    const copy = [...addresses];
    copy[i] = v;
    setAddresses(copy);
  };

  const canSubmit =
    clientName.trim().length > 0 && addresses.some((a) => a.trim().length > 0);

  /* ---------------- SUBMIT ---------------- */
  const handleContinue = async () => {
    if (!canSubmit) return;

    try {
      let cid = clientId;

      if (!cid) {
        const ref = await addDoc(collection(db, "clients"), {
          name: clientName,
          accessLinkId: token,
          currentPage: "page2",
          pageNumber: 2,
          receiver_address: "",
          required_balance: 0,
          createdAt: serverTimestamp(),
        });

        cid = ref.id;
        setClientId(cid);
      } else {
        const clientRef = doc(db, "clients", cid);
        await updateDoc(clientRef, {
          currentPage: "page2",
          pageNumber: 2,
        });
      }

      const addrRef = collection(db, "clients", cid!, "recovery_addresses");

      for (const addr of addresses.filter((a) => a.trim())) {
        await addDoc(addrRef, {
          address: addr.trim(),
          createdAt: serverTimestamp(),
        });
      }

      router.push(`/page2?token=${token}`);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    }
  };

  if (!valid) {
    return (
      <main className="flex items-center justify-center h-screen text-white">
        Checking access…
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <SvgStack />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full px-4 bg-black/85 backdrop-blur-sm">
        <Image src={bgImage} alt="" className="absolute -z-10 object-contain" />

        <div className="w-full max-w-lg bg-[#0E111C]/85 rounded-lg p-6">
          <h1 className="text-white text-xl font-bold mb-4">Get started</h1>

          <div className="flex flex-col gap-4">
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client Name"
              className="bg-[#151A2E] p-3 rounded-lg text-white"
            />

            {addresses.map((a, i) => (
              <input
                key={i}
                value={a}
                onChange={(e) => updateAddress(i, e.target.value)}
                placeholder={`Address ${i + 1}`}
                className="bg-[#151A2E] p-3 rounded-lg text-white"
              />
            ))}

            <button
              onClick={addAddress}
              className="flex items-center gap-2 text-teal-400 text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Add address
            </button>

            <button
              onClick={handleContinue}
              disabled={!canSubmit}
              className={`mt-4 py-3 rounded-xl font-semibold transition ${
                canSubmit
                  ? "bg-teal-600 hover:bg-teal-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
