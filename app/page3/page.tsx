import { Suspense } from "react";
import Page3Client from "./page3Client";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Page3Client />
    </Suspense>
  );
}

function Loading() {
  return (
    <main className="flex items-center justify-center h-screen text-white">
      Loading recovery details...
    </main>
  );
}
