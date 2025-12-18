"use client";

import { useSearchParams } from "next/navigation";

export default function Page1Client() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <div>
      <h1>Page 1</h1>
      <p>Token: {token}</p>
    </div>
  );
}
