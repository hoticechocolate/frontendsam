import type { ReactNode } from "react"

export type IconName =
  | "shield"
  | "ice"
  | "clock"
  | "alert"
  | "route"
  | "snow"
  | "thermo"
  | "sun"
  | "play"
  | "pause"
  | "left"
  | "right"
  | "info"
  | "search"
  | "swap"

const iconPaths: Record<IconName, ReactNode> = {
  shield: (
    <path d="M12 3 5 6v5c0 4.7 2.9 8.1 7 10 4.1-1.9 7-5.3 7-10V6l-7-3Zm-3 9 2 2 4-5" />
  ),
  ice: (
    <>
      <path d="M12 2v20M4.2 6.5l15.6 9M4.2 17.5l15.6-9" />
      <path d="m9 4 3 2 3-2M9 20l3-2 3 2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  alert: (
    <>
      <path d="M10.2 4.3 2.7 17.2A2 2 0 0 0 4.4 20h15.2a2 2 0 0 0 1.7-2.8L13.8 4.3a2.1 2.1 0 0 0-3.6 0Z" />
      <path d="M12 9v4M12 16.5v.1" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M7.8 16.1c2-1 1.8-3.7 4.1-4.5s3.3.1 4.7-2.7" />
    </>
  ),
  snow: (
    <>
      <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
  thermo: (
    <>
      <path d="M10 14.5V5a2 2 0 1 1 4 0v9.5a4 4 0 1 1-4 0Z" />
      <path d="M12 9v7" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" />,
  pause: <path d="M8 5v14M16 5v14" strokeWidth="2.6" />,
  left: <path d="m15 5-7 7 7 7" />,
  right: <path d="m9 5 7 7-7 7" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.6v.1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  swap: <path d="m8 8-4 4 4 4M16 8l4 4-4 4" />,
}

export default function Icon({
  name,
  className = "size-5",
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  )
}
