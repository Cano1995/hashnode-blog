import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tagOracle = await prisma.tag.upsert({
    where: { slug: "oracle-apex" },
    update: {},
    create: { name: "Oracle APEX", slug: "oracle-apex", color: "#0969DA" },
  });

  const tagForms = await prisma.tag.upsert({
    where: { slug: "oracle-forms" },
    update: {},
    create: { name: "Oracle Forms", slug: "oracle-forms", color: "#CF222E" },
  });

  const tagPlsql = await prisma.tag.upsert({
    where: { slug: "plsql" },
    update: {},
    create: { name: "PL/SQL", slug: "plsql", color: "#2DA44E" },
  });

  await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: {
      id: "settings",
      title: "Paraguayan Dev",
      description: "Blog de Oracle APEX, Oracle Forms y Desarrollo Empresarial",
      authorName: "Cristhian Cano Bogado",
      authorBio: "Desarrollador especializado en Oracle APEX y migración de Oracle Forms.",
      linkedinUrl: "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/",
    },
  });

  const post1 = await prisma.post.upsert({
    where: { slug: "bienvenido-a-paraguayan-dev" },
    update: {},
    create: {
      title: "Bienvenido a Paraguayan Dev",
      slug: "bienvenido-a-paraguayan-dev",
      excerpt: "Un blog sobre Oracle APEX, migración de Oracle Forms y desarrollo empresarial desde Paraguay.",
      content: `<h2>¡Bienvenido!</h2><p>Este blog nació para compartir conocimiento sobre Oracle APEX y el ecosistema Oracle con la comunidad hispanohablante.</p><h2>¿Qué encontrarás aquí?</h2><ul><li>Tutoriales de Oracle APEX</li><li>Guías de migración Oracle Forms</li><li>Tips de PL/SQL y SQL</li></ul>`,
      published: true,
      featured: true,
      readingTime: 2,
    },
  });

  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tagOracle.id },
      { postId: post1.id, tagId: tagForms.id },
    ],
  });

  console.log("✅ Seed completado!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
