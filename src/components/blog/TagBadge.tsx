import Link from "next/link";

interface TagBadgeProps {
  name: string;
  slug: string;
  color?: string;
  size?: "sm" | "md";
}

export function TagBadge({ name, slug, color = "#6366f1", size = "sm" }: TagBadgeProps) {
  return (
    <Link
      href={`/tag/${slug}`}
      className={`inline-flex items-center rounded-full font-medium transition-opacity hover:opacity-80 ${
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm"
      }`}
      style={{ backgroundColor: `${color}1a`, color }}
    >
      #{name}
    </Link>
  );
}
