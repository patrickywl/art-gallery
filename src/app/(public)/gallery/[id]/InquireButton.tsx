"use client";

import { datadogRum } from "@datadog/browser-rum";

export default function InquireButton({
  artworkTitle,
}: {
  artworkTitle: string;
}) {
  const handleInquire = () => {
    datadogRum.addAction("artwork_inquire", {
      artwork_title: artworkTitle,
    });
    window.location.href = `/contact?subject=${encodeURIComponent(
      `Inquiry about: ${artworkTitle}`
    )}`;
  };

  return (
    <button
      onClick={handleInquire}
      className="mt-8 w-full rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
    >
      Inquire About This Piece
    </button>
  );
}
