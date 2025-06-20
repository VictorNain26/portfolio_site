// components/Logo.tsx
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 52 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-7 sm:h-8 w-auto ${className}`}
      aria-label="Logo Victor Lenain"
    >
      <title>Victor Lenain</title>
      <polyline
        points="4,4 16,28 28,4"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="34,4 48,28"
        stroke="#6366f1"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="48,28 40,28"
        stroke="#6366f1"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
