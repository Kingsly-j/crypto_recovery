import { Suspense } from "react";
import Page5Client from "./page5Client";

export default function Page5Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <Page5Client />
    </Suspense>
  );
}
