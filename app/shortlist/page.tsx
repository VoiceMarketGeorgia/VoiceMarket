import { Suspense } from "react";
import { ShortlistView } from "@/components/shortlist-view";

export const metadata = {
  title: "მონიშნული ხმები | VoiceMarket",
};

export default function ShortlistPage() {
  return (
    // useSearchParams needs a Suspense boundary for the shared `?ids=` links.
    <Suspense fallback={<div className="container py-20" />}>
      <ShortlistView />
    </Suspense>
  );
}
