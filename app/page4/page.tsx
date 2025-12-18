import { Suspense } from "react";
import Page4Client from "./page4Client";

export default function Page4Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <Page4Client />
    </Suspense>
  );
}
