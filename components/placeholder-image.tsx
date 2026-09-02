export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-muted text-center text-xs text-muted-foreground ${className}`}
    >
      {label}
    </div>
  );
}
