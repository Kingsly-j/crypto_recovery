"use client";

import React, { useState, useEffect } from "react";
import SvgStack from "@/components/SvgStack";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [popupClient, setPopupClient] = useState<any>(null);
  const [recoverableBalance, setRecoverableBalance] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login";
        return;
      }

      // Check admin privilege
      const adminRef = doc(db, "admins", u.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        window.location.href = "/unauthorized";
        return;
      }

      setUser(u);
      setIsAdmin(true);
      setLoading(false);
      await fetchLinks();
      watchClients();
    });

    return () => unsubscribe();
  }, []);

  const fetchLinks = async () => {
    const snapshot = await getDocs(collection(db, "access_links"));
    const allLinks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLinks(allLinks);
  };

  const generateLink = async () => {
    if (!clientName) {
      alert("Enter client name");
      return;
    }

    const urlId = uuidv4();

    await addDoc(collection(db, "access_links"), {
      clientName,
      urlId,
      createdBy: user.uid,
      currentPage: "page1",
      expiresAt: null,
      createdAt: serverTimestamp(),
    });

    setClientName("");
    fetchLinks();

    alert(`${window.location.origin}/page1?token=${urlId}`);
  };

  // Watch clients for proceed1 creation
  const watchClients = async () => {
    const clientsCol = collection(db, "clients");

    // Listen for any new client documents where proceed1 is false (created but not processed)
    onSnapshot(clientsCol, (snapshot) => {
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.proceed1 === false) {
          setPopupClient({ id: docSnap.id, ...data });
        }
      });
    });
  };

  const handleSubmitProceed = async () => {
    if (!recoverableBalance || isNaN(Number(recoverableBalance))) {
      alert("Enter valid recoverable balance");
      return;
    }

    if (!popupClient) return;

    const clientRef = doc(db, "clients", popupClient.id);
    await updateDoc(clientRef, {
      recoverableBalance: Number(recoverableBalance),
      proceed1: true,
    });

    // Close popup
    setPopupClient(null);
    setRecoverableBalance("");
    alert(`${popupClient.name} is approved to proceed to Page 3`);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Verifying admin access…
      </div>
    );
  }

  if (!isAdmin) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <main className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <SvgStack />
      </div>

      <div className="relative z-10 flex items-center justify-center h-full backdrop-blur-sm bg-black/85 px-4">
        <div className="w-full max-w-lg bg-[#0E111C]/90 rounded-xl p-6">
          <h1 className="text-white text-xl font-bold mb-6 text-center">
            Admin Dashboard
          </h1>

          {/* Generate link */}
          <div className="bg-[#151A2E] p-5 rounded-xl mb-6">
            <label className="text-sm text-gray-400 block mb-2">
              Client Name
            </label>

            <div className="relative">
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Enter client name"
                className="w-full bg-[#151A2E] border border-[#2A2F4A] rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
              <PlusIcon
                onClick={generateLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer hover:text-teal-400"
              />
            </div>
          </div>

          {/* Active links */}
          <div className="max-h-72 overflow-y-auto space-y-3 scrollbar-hidden">
            {links.map((link) => (
              <div
                key={link.id}
                className="bg-[#151A2E] p-4 rounded-lg text-sm"
              >
                <p className="text-white">
                  <strong>Client:</strong> {link.clientName}
                </p>
                <p className="text-teal-400 break-all">
                  {origin}/page1?token={link.urlId}
                </p>
                <p className="text-gray-400">
                  <strong>Current Page:</strong> {link.currentPage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popup form for proceed1 */}
        {popupClient && (
          <div className="fixed inset-0 scrollbar-hidden bg-black/70 flex items-center justify-center z-50">
            <div className="bg-[#0E111C] p-6 rounded-xl max-w-md w-full space-y-4">
              <h2 className="text-white text-lg font-bold">
                Approve {popupClient.name}
              </h2>

              <label className="text-gray-400 text-sm">
                Recoverable Balance
              </label>
              <input
                type="number"
                value={recoverableBalance}
                onChange={(e) => setRecoverableBalance(e.target.value)}
                placeholder="Enter recoverable balance"
                className="w-full bg-[#151A2E] p-3 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />

              <button
                onClick={handleSubmitProceed}
                className="w-full bg-teal-600 hover:bg-teal-500 p-3 rounded-xl font-semibold text-white"
              >
                Approve and Proceed
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
