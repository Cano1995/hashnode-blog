import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { TagBadge } from "./TagBadge";
import { formatDate } from "@/lib/utils";
import type { Post, Tag, PostTag } from "@/generated/prisma/client";

type PostWithTags = Post & { tags: (PostTag & { tag: Tag })[] };

export function PostCard({ post }: { post: PostWithTags }) {
  return (
    <article
      className="post-card flex flex-col rounded-md overflow-hidden group"
      style={{
        background: "var(--c-surface)",
        border: "1px solid var(--c-border)",
      }}
    >
      {post.coverImage && (
        <Link href={`/${post.slug}`} className="block overflow-hidden" style={{ height: 176 }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            width={640}
            height={176}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        </Link>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/${post.slug}`}>
          <h2
            className="post-card-title font-semibold text-[15px] leading-snug line-clamp-2 transition-colors"
            style={{ color: "var(--c-text)" }}
          >
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-[13px] line-clamp-2 leading-relaxed" style={{ color: "var(--c-muted)" }}>
            {post.excerpt.replace(/<[^>]*>/g, "")}
          </p>
        )}

        {/* Meta */}
        <div
          className="flex items-center gap-4 text-[12px] mt-auto pt-3"
          style={{ color: "var(--c-subtle)", borderTop: "1px solid var(--c-border)" }}
        >
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Eye className="w-3 h-3" />
            {post.views.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}

export function PostCardFeatured({ post }: { post: PostWithTags }) {
  return (
    <article
      className="rounded-md overflow-hidden"
      style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
    >
      <div className="flex flex-col md:flex-row">
        {post.coverImage && (
          <Link href={`/${post.slug}`} className="block shrink-0 overflow-hidden md:w-72 lg:w-96" style={{ minHeight: 200 }}>
            <Image
              src={post.coverImage}
              alt={post.title}
              width={400}
              height={260}
              className="w-full h-full object-cover"
            />
          </Link>
        )}
        <div className="flex flex-col justify-center p-6 gap-3">
          <div className="flex items-center gap-2">
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide"
              style={{ background: "var(--c-primary)", color: "#fff" }}
            >
              Destacado
            </span>
            {post.tags.slice(0, 2).map(({ tag }) => (
              <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />
            ))}
          </div>

          <Link href={`/${post.slug}`}>
            <h2
              className="font-bold text-xl leading-snug"
              style={{ color: "var(--c-text)" }}
            >
              {post.title}
            </h2>
          </Link>

          {post.excerpt && (
            <p className="text-sm line-clamp-3 leading-relaxed" style={{ color: "var(--c-muted)" }}>
              {post.excerpt.replace(/<[^>]*>/g, "")}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--c-subtle)" }}>
            <span>{formatDate(post.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} min</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
