import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { TagBadge } from "./TagBadge";
import { formatDate } from "@/lib/utils";
import type { Post, Tag, PostTag } from "@/generated/prisma/client";

type PostWithTags = Post & { tags: (PostTag & { tag: Tag })[] };

export function PostCard({ post }: { post: PostWithTags }) {
  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {post.coverImage && (
        <Link href={`/${post.slug}`}>
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map(({ tag }) => (
            <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} />
          ))}
        </div>
        <Link href={`/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-gray-500 text-sm line-clamp-3 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
      </div>
    </article>
  );
}

export function PostCardFeatured({ post }: { post: PostWithTags }) {
  return (
    <article className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl overflow-hidden group">
      <div className="p-8 md:p-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white"
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <Link href={`/${post.slug}`}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:underline line-clamp-2">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && (
          <p className="text-indigo-100 line-clamp-3 mb-6">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-indigo-200">
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.readingTime} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {post.views}
          </span>
        </div>
      </div>
    </article>
  );
}
