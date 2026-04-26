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
      `작품 문의: ${artworkTitle}`
    )}`;
  };

  return (
    <button
      onClick={handleInquire}
      className="mt-8 w-full rounded-full bg-zinc-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-auto"
    >
      이 작품 문의하기
    </button>
  );
}
