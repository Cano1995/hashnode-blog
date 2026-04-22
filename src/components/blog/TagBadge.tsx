import Link from "next/link";

interface TagBadgeProps {
  name: string;
  slug: string;
  color?: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, slug, color = "#6366f1", size = "sm" }: TagBadgeProps) {
  const pad = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm";
  return (
    <Link
      href={`/tag/${slug}`}
      className={`inline-flex items-center rounded font-medium transition-opacity hover:opacity-75 ${pad}`}
      style={{ backgroundColor: `${color}22`, color, border: `1px solid ${color}44` }}
    >
      {name}
    </Link>
  );
}
