import { Suspense } from "react";
import Page6Client from "./page6Client";

export default function Page6Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <Page6Client />
    </Suspense>
  );
}
