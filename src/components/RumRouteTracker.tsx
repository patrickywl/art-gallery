"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { datadogRum } from "@datadog/browser-rum";

export default function RumRouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    datadogRum.addAction("page_view", {
      path: pathname,
    });
  }, [pathname]);

  return null;
}
