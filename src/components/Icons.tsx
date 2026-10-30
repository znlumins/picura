import React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function IconSpinner({ className = "w-4 h-4 animate-spin", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} {...props}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path strokeLinecap="round" d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

export function IconSearch({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m17.5 17.5-4.2-4.2m1.7-4.3a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
    </svg>
  );
}

export function IconClose({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export function IconCheck({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 10 4 4 7-8" />
    </svg>
  );
}

export function IconCheckCircle({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m7 10 2 2 4-4" />
    </svg>
  );
}

export function IconChevronRight({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 5 5 5-5 5" />
    </svg>
  );
}

export function IconChevronLeft({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m12.5 5-5 5 5 5" />
    </svg>
  );
}

export function IconChevronDown({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function IconArrowRight({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 10h12m-4-4 4 4-4 4" />
    </svg>
  );
}

export function IconPlus({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4.5v11m-5.5-5.5h11" />
    </svg>
  );
}

export function IconCopy({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="7" y="7" width="9" height="9" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 13V5a1 1 0 0 1 1-1h8" />
    </svg>
  );
}

export function IconExternalLink({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5h-5m5 0v5m0-5L8 12M5 8v7a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

export function IconLock({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="4.5" y="9" width="11" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

export function IconUnlock({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="4.5" y="9" width="11" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9V6.5a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function IconKey({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="7.5" cy="7.5" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 10.5 6 6m-2-1 1.5 1.5m-3-1.5 1.5 1.5" />
    </svg>
  );
}

export function IconUser({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="10" cy="6" r="3" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 16.5a5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

export function IconSettings({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="10" cy="10" r="2.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5v2m0 11v2m7.5-7.5h-2m-11 0h-2m13.2-5.7-1.4 1.4m-8.6 8.6-1.4 1.4m11.4 0-1.4-1.4m-8.6-8.6-1.4-1.4" />
    </svg>
  );
}

export function IconLogOut({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 14l4-4m0 0l-4-4m4 4H7m3 7H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

export function IconLogIn({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 6l4 4m0 0l-4 4m4-4H1m14-7h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2" />
    </svg>
  );
}

export function IconTrash({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h12m-1.5 0v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1V6m3-2.5h3" />
    </svg>
  );
}

export function IconEye({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10s3-5.5 8-5.5 8 5.5 8 5.5-3 5.5-8 5.5-8-5.5-8-5.5Z" />
      <circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}

export function IconPhoto({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="3" y="3" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 14 4.5-4.5 4 4m2-2 3.5 3.5" />
    </svg>
  );
}

export function IconFolder({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a1 1 0 0 1 1-1h4.5l2 2H16a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z" />
    </svg>
  );
}

export function IconShield({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5 3.5 5.5v5c0 4.5 3.5 7.5 6.5 8.5 3-1 6.5-4 6.5-8.5v-5L10 2.5Z" />
    </svg>
  );
}

export function IconDownload({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3.5v9m0 0 3.5-3.5M10 12.5 6.5 9M4 16.5h12" />
    </svg>
  );
}

export function IconRefresh({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.5 10a7.5 7.5 0 1 1-2.2-5.3L17.5 7m0-4.5V7h-4.5" />
    </svg>
  );
}

export function IconLayers({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 7.5 10 3l7.5 4.5L10 12 2.5 7.5Zm0 5 7.5 4.5 7.5-4.5" />
    </svg>
  );
}

export function IconWhatsApp({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 3a7 7 0 0 0-6.1 10.4L3 17l3.8-.9A7 7 0 1 0 10 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.8 7.8c.2-.5.5-.5.8-.5.2 0 .4 0 .5.1.2.2.6 1.4.6 1.5 0 .2 0 .4-.1.5l-.3.4c-.1.1-.2.2-.1.4.3.5.7 1 1.2 1.4.5.4 1 .7 1.6.9.2.1.3 0 .4-.1l.5-.6c.1-.2.3-.2.5-.1.2.1 1.3.6 1.5.7.2.1.3.2.3.4s-.1.9-.6 1.2c-.5.3-1.1.3-2.1-.1-1.3-.5-2.6-1.7-3.4-3-.8-1.2-.9-2.3-.5-2.8.2-.2.4-.4.5-.6Z" />
    </svg>
  );
}

export function IconHeart({ className = "w-4 h-4", filled = false, ...props }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? "0" : "1.5"}
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 16.5s-6.5-4.1-6.5-8.5a4 4 0 0 1 7-2.3 4 4 0 0 1 7 2.3c0 4.4-6.5 8.5-6.5 8.5Z"
      />
    </svg>
  );
}

export function IconMail({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="3" y="4.5" width="14" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 6 6.5 5 6.5-5" />
    </svg>
  );
}

export function IconPhone({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 4.5A2 2 0 0 1 5.5 2.5h2a1 1 0 0 1 1 .8l.8 2.5a1 1 0 0 1-.3 1l-1.3 1.3a10.5 10.5 0 0 0 4.7 4.7l1.3-1.3a1 1 0 0 1 1-.3l2.5.8a1 1 0 0 1 .8 1v2a2 2 0 0 1-2 2A14.5 14.5 0 0 1 2.5 4.5v0Z" />
    </svg>
  );
}

export function IconBuilding({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="4" y="3" width="12" height="14" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 6h1.5m3 0H13m-6 3.5h1.5m3 0H13M7 13h1.5m3 0H13M9 17v-2.5h2V17" />
    </svg>
  );
}

export function IconAlert({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6.5v4m0 3h.01" />
    </svg>
  );
}

export function IconClock({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <circle cx="10" cy="10" r="7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6v4.5l3 1.5" />
    </svg>
  );
}

export function IconDashboard({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <rect x="3" y="3" width="6" height="7" rx="1.5" strokeLinecap="round" />
      <rect x="11" y="3" width="6" height="4" rx="1.5" strokeLinecap="round" />
      <rect x="11" y="9" width="6" height="8" rx="1.5" strokeLinecap="round" />
      <rect x="3" y="12" width="6" height="5" rx="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconCrown({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.5 14 1.5-8.5 3.5 4 1.5-6 1.5 6 3.5-4 1.5 8.5H3.5Z" />
    </svg>
  );
}

export function IconFileText({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3.5h7l4 4V16a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 16V5A1.5 1.5 0 0 1 5 3.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.5V7.5h4M6.5 10.5h7M6.5 13.5h4" />
    </svg>
  );
}

export function IconMessage({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10a6.5 6.5 0 0 1-10.4 5.2L3 16l.8-3.1A6.5 6.5 0 1 1 16.5 10Z" />
    </svg>
  );
}

export function IconSync({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 8A6.5 6.5 0 0 1 14.8 5.2L16.5 7M16.5 3.5V7H13m3.5 5a6.5 6.5 0 0 1-11.3 2.8L3.5 13M3.5 16.5V13H7" />
    </svg>
  );
}

export function IconSave({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 3.5h9.5L16.5 6.5V16a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1h.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 3.5v4h6v-4m-6 13v-5h7v5" />
    </svg>
  );
}

export function IconSparkles({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 2.5v15M2.5 10h15m-11-5.5 7 7m0-7-7 7" />
    </svg>
  );
}

/* Pixel-Art Mosaic Decoration from Lightdash Spec */
export function PixelArtMosaic({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-6 gap-1 w-24 h-24 select-none pointer-events-none opacity-85 ${className}`}>
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#c8ccf3] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-[#dfdbff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />

      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#dfdbff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#c8ccf3] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />

      <span className="w-2.5 h-2.5 bg-[#c8ccf3] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#dfdbff] rounded-[1px]" />

      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-transparent" />
      <span className="w-2.5 h-2.5 bg-[#dfdbff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-[#c8ccf3] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-[#5e4cff] rounded-[1px]" />
      <span className="w-2.5 h-2.5 bg-transparent" />
    </div>
  );
}
