// app/robots.ts

import type { MetadataRoute } from "next";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Legacy marketing pages are offline (redirect to home); keep crawlers off them.
        disallow: [
          "/delete-account",
          "/admin",
          "/admin-ax7k2/login",
          "/quizzes",
          "/quiz",
          "/date-spots",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
