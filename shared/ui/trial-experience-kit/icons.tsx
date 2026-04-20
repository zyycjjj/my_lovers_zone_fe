"use client";

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18L9 12L15 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
    </svg>
  );
}

export function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5 2L6 13H11L10.5 22L18 11H13L13.5 2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="20" viewBox="0 0 20 20" width="20" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.25 2.5L6.25 9.83333H9.58333L9.16667 16.1667L14.1667 8.83333H10.8333L11.25 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="18" viewBox="0 0 18 18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 2.25C6.51472 2.25 4.5 4.26472 4.5 6.75C4.5 8.45529 5.44418 9.93928 6.83984 10.7081C7.05842 10.8285 7.2 11.0474 7.2 11.2969V12.375H10.8V11.2969C10.8 11.0474 10.9416 10.8285 11.1602 10.7081C12.5558 9.93928 13.5 8.45529 13.5 6.75C13.5 4.26472 11.4853 2.25 9 2.25Z"
        fill="currentColor"
      />
      <path d="M7.5 14.25H10.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <path d="M7.875 16H10.125" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

export function LaunchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 16L16 8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.9" />
      <path
        d="M9.5 8H16V14.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
    </svg>
  );
}

