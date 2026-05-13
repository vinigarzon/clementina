#!/usr/bin/env node
/**
 * Verifica que los posts del blog estén en la base.
 * Uso: npm run check-blog
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "..");
const envPath = resolve(appDir, ".env.local");
if (!existsSync(envPath)) {
  console.error("❌ No encontré .env.local");
  process.exit(1);
}

const env = {};
for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^['"](.+)['"]$/, "$1");
}

let url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("❌ Falta URL o SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}
try {
  const u = new URL(url);
  url = `${u.protocol}//${u.host}`;
} catch {}

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("\n📝 Estado del blog en Supabase\n");

const { data, error, count } = await sb
  .from("blog_posts")
  .select("slug, title_es, published, cover_url", { count: "exact" });

if (error) {
  console.error("❌ Error:", error.message);
  if (error.message.includes("relation") && error.message.includes("does not exist")) {
    console.error(
      "   La tabla blog_posts no existe. ¿Aplicaste la migración 0004?",
    );
    console.error("   Corre: npm run copy-migration -- 0004");
  }
  process.exit(1);
}

console.log(`Total de posts en BD: ${count ?? 0}\n`);
if (!data || data.length === 0) {
  console.log("⚠️  No hay posts. La migración corrió pero no insertó filas.");
  console.log("   Posibles causas:");
  console.log("   - La migración se aplicó sobre filas que ya existían");
  console.log("   - El INSERT falló silenciosamente por algún conflicto\n");
} else {
  for (const p of data) {
    const mark = p.published ? "✓" : "○";
    console.log(`  ${mark} ${p.slug.padEnd(40)} → ${p.title_es}`);
    console.log(`      cover: ${p.cover_url || "(sin portada)"}`);
  }
  console.log("");
}
