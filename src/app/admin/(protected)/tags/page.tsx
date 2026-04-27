import { prisma } from "@/lib/prisma";
import { TagManager } from "./TagManager";

export const dynamic = "force-dynamic";

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return <TagManager initialTags={tags} />;
}
