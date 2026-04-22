import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="flex flex-col h-screen">
      <PostForm allTags={tags} />
    </div>
  );
}
