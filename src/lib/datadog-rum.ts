import { datadogRum } from "@datadog/browser-rum";

export function initDatadogRum() {
  if (typeof window === "undefined") return;

  const applicationId = process.env.NEXT_PUBLIC_DD_APPLICATION_ID;
  const clientToken = process.env.NEXT_PUBLIC_DD_CLIENT_TOKEN;

  if (!applicationId || !clientToken) {
    console.warn("Datadog RUM: missing applicationId or clientToken");
    return;
  }

  datadogRum.init({
    applicationId,
    clientToken,
    site: process.env.NEXT_PUBLIC_DD_SITE || "datadoghq.com",
    service: process.env.NEXT_PUBLIC_DD_SERVICE || "art-gallery",
    env: process.env.NEXT_PUBLIC_DD_ENV || "production",
    version: "1.0.0",
    sessionSampleRate: 100,
    sessionReplaySampleRate: 100,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
    allowedTracingUrls: [
      {
        match: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        propagatorTypes: ["tracecontext" as const],
      },
    ],
  });
}

export { datadogRum };
