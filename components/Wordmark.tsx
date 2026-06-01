export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-sans text-[1.45rem] font-medium leading-none tracking-tight text-ink ${className}`}
    >
      nexso
      <span className="text-primary">.</span>
    </span>
  );
}
