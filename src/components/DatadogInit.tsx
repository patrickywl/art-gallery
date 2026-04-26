"use client";

import { useEffect } from "react";
import { initDatadogRum } from "@/lib/datadog-rum";

export default function DatadogInit() {
  useEffect(() => {
    initDatadogRum();
  }, []);

  return null;
}
