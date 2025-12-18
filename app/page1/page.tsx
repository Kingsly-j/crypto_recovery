import { Suspense } from "react";
import Page1Client from "./page1Client";

export default function Page1() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center h-screen text-white">
          Loading…
        </main>
      }
    >
      <Page1Client />
    </Suspense>
  );
}
