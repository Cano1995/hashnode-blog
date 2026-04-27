import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Paraguayan Dev — Oracle APEX, Oracle Forms y Desarrollo Empresarial";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0D1117",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #0969DA 0%, #218BFF 100%)",
          }}
        />

        {/* Site name */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#58A6FF",
            marginBottom: 32,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Paraguayan Dev
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            color: "#E6EDF3",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 28,
            maxWidth: 900,
          }}
        >
          Oracle APEX y Desarrollo Empresarial
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 8,
          }}
        >
          {["Oracle APEX", "Oracle Forms", "PL/SQL", "SQL"].map((tag) => (
            <div
              key={tag}
              style={{
                background: "rgba(9, 105, 218, 0.15)",
                border: "1px solid rgba(9, 105, 218, 0.4)",
                borderRadius: 6,
                padding: "6px 16px",
                fontSize: 20,
                color: "#58A6FF",
                fontWeight: 500,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#6E7781",
          }}
        >
          paraguayandev.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
