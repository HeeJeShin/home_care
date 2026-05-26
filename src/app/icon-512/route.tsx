import { ImageResponse } from "next/og";

export const GET = (): ImageResponse =>
  new ImageResponse(
    (
      <div
        style={{
          fontSize: 280,
          background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: 700,
          borderRadius: 100,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        H
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
