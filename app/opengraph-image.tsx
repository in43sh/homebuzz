import { ImageResponse } from "next/og";
import { siteName } from "@/lib/site";

// Branded default Open Graph image, applied site-wide (and reused for Twitter
// cards) unless a route provides its own opengraph-image or openGraph.images.
export const alt = `${siteName} — Home improvement store`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1b1e1f",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#ffce3a",
          }}
        >
          {siteName}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 76,
            fontWeight: 900,
            lineHeight: 1.05,
            maxWidth: 900,
          }}
        >
          Everything for your home, in one place.
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#cfd7dc" }}>
          Paint · Tools · Hardware · Delivered fast and free
        </div>
      </div>
    ),
    size,
  );
}
