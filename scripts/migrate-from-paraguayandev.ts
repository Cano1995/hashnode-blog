import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";
import slugify from "slugify";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

const HASHNODE_API = "https://gql.hashnode.com/";
const PUBLICATION_HOST = "www.paraguayandev.com";

interface HashnodePost {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  readTimeInMinutes: number;
  brief: string;
  coverImage?: { url: string };
  content: { html: string };
  tags: Array<{ name: string; slug: string }>;
  featured: boolean;
  views?: number;
}

interface HashnodeResponse {
  data: {
    publication: {
      id: string;
      posts: {
        edges: Array<{ node: HashnodePost; cursor: string }>;
        pageInfo: { hasNextPage: boolean; endCursor: string };
      };
    };
  };
}

const POSTS_QUERY = `
  query GetPosts($host: String!, $first: Int!, $after: String) {
    publication(host: $host) {
      id
      posts(first: $first, after: $after) {
        edges {
          cursor
          node {
            id
            title
            slug
            publishedAt
            readTimeInMinutes
            brief
            featured
            coverImage { url }
            content { html }
            tags { name slug }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

async function fetchAllPosts(): Promise<HashnodePost[]> {
  const allPosts: HashnodePost[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  let page = 1;

  while (hasNextPage) {
    console.log(`  Descargando página ${page}...`);

    const res = await fetch(HASHNODE_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: POSTS_QUERY,
        variables: {
          host: PUBLICATION_HOST,
          first: 20,
          after: cursor,
        },
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

    const json = (await res.json()) as HashnodeResponse;

    if (!json.data?.publication) {
      throw new Error("Publicación no encontrada. Verifica el host.");
    }

    const { edges, pageInfo } = json.data.publication.posts;
    allPosts.push(...edges.map((e) => e.node));

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
    page++;
  }

  return allPosts;
}

async function ensureTag(name: string, tagSlug: string): Promise<string> {
  const slug = tagSlug || slugify(name, { lower: true, strict: true });

  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) return existing.id;

  const COLORS: Record<string, string> = {
    apex: "#e35a16",
    oracle: "#e35a16",
    plsql: "#c0392b",
    sql: "#2980b9",
    javascript: "#f39c12",
    python: "#3498db",
    html: "#e74c3c",
    css: "#1abc9c",
    database: "#8e44ad",
    lowcode: "#27ae60",
  };

  const color = COLORS[slug.toLowerCase()] ?? "#6366f1";

  const tag = await prisma.tag.create({ data: { name, slug, color } });
  return tag.id;
}

async function importPost(post: HashnodePost): Promise<void> {
  // Generate unique slug
  const baseSlug = post.slug || slugify(post.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findFirst({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  // Clean up HTML content (remove hashnode-specific wrappers if any)
  const content = post.content.html || "";

  const createdPost = await prisma.post.create({
    data: {
      title: post.title,
      slug,
      excerpt: post.brief || content.replace(/<[^>]*>/g, "").substring(0, 250),
      content,
      coverImage: post.coverImage?.url ?? null,
      published: true,
      featured: post.featured ?? false,
      readingTime: post.readTimeInMinutes || 1,
      views: 0,
      createdAt: new Date(post.publishedAt),
      updatedAt: new Date(post.publishedAt),
    },
  });

  // Assign tags
  if (post.tags?.length) {
    for (const tag of post.tags) {
      const tagId = await ensureTag(tag.name, tag.slug);
      await prisma.postTag.create({
        data: { postId: createdPost.id, tagId },
      });
    }
  }
}

async function main() {
  console.log("🚀 Iniciando migración desde paraguayandev.com...\n");

  // Fetch all posts from Hashnode API
  console.log("📥 Descargando posts desde la API de Hashnode...");
  const posts = await fetchAllPosts();
  console.log(`✅ ${posts.length} posts descargados.\n`);

  // Update site settings
  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {
      title: "Paraguayan Dev",
      description: "Blog sobre Oracle APEX, desarrollo de aplicaciones y bases de datos",
      authorName: "Cristhian Cano Bogado",
      authorBio: "Desarrollador Oracle APEX. Migrando formularios Oracle Forms a APEX y construyendo nuevas aplicaciones empresariales.",
    },
    create: {
      id: "settings",
      title: "Paraguayan Dev",
      description: "Blog sobre Oracle APEX, desarrollo de aplicaciones y bases de datos",
      authorName: "Cristhian Cano Bogado",
      authorBio: "Desarrollador Oracle APEX. Migrando formularios Oracle Forms a APEX y construyendo nuevas aplicaciones empresariales.",
    },
  });

  // Import each post
  console.log("💾 Importando posts a la base de datos...");
  let success = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      process.stdout.write(`  [${success + failed + 1}/${posts.length}] ${post.title.substring(0, 60)}... `);
      await importPost(post);
      console.log("✓");
      success++;
    } catch (err) {
      console.log(`✗ (${(err as Error).message})`);
      failed++;
    }
  }

  const tags = await prisma.tag.count();
  console.log(`
╔════════════════════════════════════════╗
║         Migración completada           ║
╠════════════════════════════════════════╣
║  Posts importados:  ${String(success).padEnd(19)}║
║  Posts fallidos:    ${String(failed).padEnd(19)}║
║  Etiquetas creadas: ${String(tags).padEnd(19)}║
╚════════════════════════════════════════╝
  `);
}

main()
  .catch((err) => {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
