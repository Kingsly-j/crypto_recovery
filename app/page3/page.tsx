import { Suspense } from "react";
import Page3Client from "./page3Client";

export default function Page3Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-white">
          Loading page...
        </div>
      }
    >
      <Page3Client />
    </Suspense>
  );
}
