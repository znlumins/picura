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
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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

export function IconGoogle({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}


export function IconSun({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

export function IconMoon({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}


export function IconMoreHorizontal({ className = "w-4 h-4", ...props }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} {...props}>
      <circle cx="4" cy="10" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="16" cy="10" r="1.5" />
    </svg>
  );
}
