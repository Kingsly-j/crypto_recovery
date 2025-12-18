import { Suspense } from "react";
import Page2Client from "./page2Client";

export const dynamic = "force-dynamic"; // optional, disables prerender

export default function Page2() {
  return (
    <Suspense
      fallback={
        <main className="flex items-center justify-center h-screen text-white">
          Loading…
        </main>
      }
    >
      <Page2Client />
    </Suspense>
  );
}
