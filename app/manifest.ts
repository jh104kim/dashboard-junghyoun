import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Personal Life OS Dashboard",
    short_name: "Life OS",
    description: "Private health, asset, retirement, tax, and AI insight dashboard.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090d",
    theme_color: "#08090d",
    orientation: "landscape",
    categories: ["productivity", "finance", "health"],
  };
}
