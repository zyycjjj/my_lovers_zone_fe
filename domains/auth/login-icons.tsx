import type { ReactNode } from "react";

export function PhoneIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M6.667 2.917h6.666a1.25 1.25 0 0 1 1.25 1.25v11.666a1.25 1.25 0 0 1-1.25 1.25H6.667a1.25 1.25 0 0 1-1.25-1.25V4.167a1.25 1.25 0 0 1 1.25-1.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.75 14.583h2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M5.833 8.333a1.25 1.25 0 0 1 1.25-1.25h5.834a1.25 1.25 0 0 1 1.25 1.25v6.25a1.25 1.25 0 0 1-1.25 1.25H7.083a1.25 1.25 0 0 1-1.25-1.25v-6.25Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.917 7.083V5.833a2.083 2.083 0 1 1 4.166 0v1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function CaptchaIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="M5.417 6.667 10 3.75l4.583 2.917v6.666L10 16.25l-4.583-2.917V6.667Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M7.917 10h4.166M7.917 12.5h2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function BoltBadge() {
  return (
    <div className="mx-auto flex size-14 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#4a3168_0%,#6a447f_52%,#d4668f_100%)] text-white shadow-[0_10px_40px_rgba(74,49,104,0.25)]">
      <svg aria-hidden="true" className="size-8" fill="none" viewBox="0 0 32 32">
        <path
          d="M17.147 5.333 9.333 17.058h6.217L14.853 26.667l7.814-11.725H16.45l.697-9.609Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

export function GiftIcon() {
  return (
    <svg aria-hidden="true" className="size-7" fill="none" viewBox="0 0 28 28">
      <path
        d="M5.833 10.5h16.334v10.5a1.75 1.75 0 0 1-1.75 1.75H7.583A1.75 1.75 0 0 1 5.833 21V10.5Zm0 0h16.334v-3.5a1.75 1.75 0 0 0-1.75-1.75H7.583A1.75 1.75 0 0 0 5.833 7v3.5Zm8.167-5.25v17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
      <path
        d="M13.417 5.833H11.96A2.626 2.626 0 0 1 9.333 3.208v0A2.626 2.626 0 0 1 11.959.583c1.415 0 2.63.992 2.913 2.379l.295 1.454h-1.75Zm1.166 0h1.458a2.626 2.626 0 0 0 2.626-2.625v0A2.626 2.626 0 0 0 16.04.583c-1.414 0-2.63.992-2.912 2.379l-.296 1.454h1.75Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

export function HelpIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.55 6.35a1.5 1.5 0 1 1 2.42 1.18c-.57.45-.97.77-.97 1.47"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="11.4" r=".75" fill="currentColor" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 20 20">
      <path
        d="m11.667 5-5 5 5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function InlineIconCircle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex size-14 items-center justify-center rounded-[20px] bg-[rgba(255,255,255,0.1)] text-white">
      {children}
    </div>
  );
}
