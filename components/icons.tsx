type IconName = "search" | "bag" | "heart" | "user" | "arrow" | "feather" | "sparkle" | "shield" | "truck" | "instagram";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.45, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths = {
    search: <><circle cx="10.8" cy="10.8" r="7.3" /><path d="m16.3 16.3 5 5" /></>,
    bag: <><path d="M4 8h16l-1.2 13H5.2L4 8Z" /><path d="M8.5 9V6.5a3.5 3.5 0 0 1 7 0V9" /></>,
    heart: <path d="M20.8 8c0 5.1-8.8 11.1-8.8 11.1S3.2 13.1 3.2 8a4.8 4.8 0 0 1 8.8-2.6A4.8 4.8 0 0 1 20.8 8Z" />,
    user: <><circle cx="12" cy="7" r="4" /><path d="M4.5 21v-1a7.5 7.5 0 0 1 15 0v1" /></>,
    arrow: <><path d="M20 12H4" /><path d="m10 6-6 6 6 6" /></>,
    feather: <><path d="M20 4C12 5 7 11 5 19c7 0 15-8 15-15Z" /><path d="M3 21c5-6 10-10 15-14" /></>,
    sparkle: <><path d="m12 2 1.9 7.6L21 12l-7.1 2.4L12 22l-1.9-7.6L3 12l7.1-2.4L12 2Z" /></>,
    shield: <><path d="m12 2 8 4v5.5c0 4.5-3.3 8-8 10-4.7-2-8-5.5-8-10V6l8-4Z" /><path d="m8 12 2.5 2.5L16 9" /></>,
    truck: <><path d="M2 5h13v12H2V5ZM15 10h3l4 4v3h-7" /><circle cx="6" cy="18.5" r="1.5" /><circle cx="18" cy="18.5" r="1.5" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.1" /></>
  };
  return <svg {...common}>{paths[name]}</svg>;
}
