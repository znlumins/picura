"use client";

export default function AmbientGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top-left Ambient Glow: 640px circle, 55px blur */}
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* Bottom-right Ambient Glow: 720px circle */}
      <div
        className="absolute -bottom-40 -right-40 w-[720px] h-[720px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(55px)",
        }}
      />

      {/* Subtle Grain Texture Overlay */}
      <div className="absolute inset-0 bg-grain opacity-35" />
    </div>
  );
}
