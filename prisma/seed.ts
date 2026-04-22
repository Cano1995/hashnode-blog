import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tagJs = await prisma.tag.upsert({
    where: { slug: "javascript" },
    update: {},
    create: { name: "JavaScript", slug: "javascript", color: "#eab308" },
  });

  const tagReact = await prisma.tag.upsert({
    where: { slug: "react" },
    update: {},
    create: { name: "React", slug: "react", color: "#0ea5e9" },
  });

  const tagNextjs = await prisma.tag.upsert({
    where: { slug: "nextjs" },
    update: {},
    create: { name: "Next.js", slug: "nextjs", color: "#6366f1" },
  });

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      title: "DevBlog",
      description: "Un blog sobre tecnología y programación",
      authorName: "Tu Nombre",
      authorBio: "Desarrollador apasionado por la tecnología",
      githubUrl: "https://github.com",
    },
  });

  const post1 = await prisma.post.upsert({
    where: { slug: "bienvenido-a-mi-blog" },
    update: {},
    create: {
      title: "Bienvenido a mi blog",
      slug: "bienvenido-a-mi-blog",
      excerpt: "Este es mi primer artículo, donde explico de qué va este blog y qué puedes esperar.",
      content: `<h2>¡Bienvenido!</h2><p>Este es mi blog personal donde compartiré artículos sobre tecnología, programación y todo lo que aprendo en el camino.</p><h2>¿Qué encontrarás aquí?</h2><ul><li>Tutoriales de JavaScript y TypeScript</li><li>Proyectos con React y Next.js</li><li>Buenas prácticas de desarrollo</li></ul><p>¡Espero que el contenido te sea útil!</p>`,
      published: true,
      featured: true,
      readingTime: 2,
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tagJs.id },
      { postId: post1.id, tagId: tagReact.id },
    ],
      });

  const post2 = await prisma.post.upsert({
    where: { slug: "primeros-pasos-con-nextjs" },
    update: {},
    create: {
      title: "Primeros pasos con Next.js 16",
      slug: "primeros-pasos-con-nextjs",
      excerpt: "Next.js 16 trae Turbopack por defecto y muchas mejoras. Aprende a configurarlo.",
      content: `<h2>Next.js 16</h2><p>La versión 16 de Next.js incluye cambios importantes como Turbopack como bundler por defecto.</p><h2>Instalación</h2><pre><code>npx create-next-app@latest mi-app</code></pre><p>Con esto tendrás un proyecto listo para desarrollar.</p>`,
      published: true,
      readingTime: 3,
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: post2.id, tagId: tagNextjs.id },
      { postId: post2.id, tagId: tagReact.id },
    ],
      });

  console.log("✅ Seed completado!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
