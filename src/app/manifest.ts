import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "HomeCare - 홈펌프 자가관리",
  short_name: "HomeCare",
  description: "홈펌프 항암제 자가관리 웹앱",
  start_url: "/",
  display: "standalone",
  background_color: "#ffffff",
  theme_color: "#2563EB",
  icons: [
    {
      src: "/icon",
      sizes: "32x32",
      type: "image/png",
    },
    {
      src: "/apple-icon",
      sizes: "180x180",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-192",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-192",
      sizes: "192x192",
      type: "image/png",
      purpose: "maskable",
    },
    {
      src: "/icon-512",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-512",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
});

export default manifest;
