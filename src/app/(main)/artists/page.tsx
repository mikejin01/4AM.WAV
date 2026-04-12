import type { Metadata } from "next";

import ArtistsPage from "@/features/artists/ArtistsPage";

export const metadata: Metadata = {
  title: "Artists | 4AM.WAV",
  description:
    "Meet the DJs and producers behind 4AM.WAV — the sounds pushing NYC nightlife forward.",
};

export default function Page() {
  return <ArtistsPage />;
}
