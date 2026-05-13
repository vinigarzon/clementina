#!/usr/bin/env node
/**
 * Detecta duplicados en gallery_assets y los limpia.
 *
 * Lógica:
 *  - Agrupa por alt_es normalizado (lowercase, sin espacios extra).
 *  - Para cada grupo con más de 1 entrada, si hay al menos una en
 *    Supabase Storage Y al menos una en /public/, borra la(s) de /public/.
 *  - Si todas son del mismo origen, no hace nada (lo dejas tú al admin).
 *
 * Uso:
 *   npm run gallery-cleanup           # solo muestra qué haría (dry run)
 *   npm run gallery-cleanup -- --apply  # aplica los cambios
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

const apply = process.argv.includes("--apply");

const sb = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

console.log("\n🧹 Limpieza de duplicados en galería\n");
console.log(apply ? "Modo: APLICAR (se ejecutarán las eliminaciones)\n" : "Modo: SIMULACIÓN (no se borra nada, usa --apply para confirmar)\n");

const { data: assets, error } = await sb
  .from("gallery_assets")
  .select("id, image_url, alt_es, alt_en, tag, featured, sort_order, created_at")
  .order("created_at", { ascending: true });

if (error) {
  console.error("❌ Error al consultar:", error.message);
  process.exit(1);
}

if (!assets || assets.length === 0) {
  console.log("No hay imágenes en gallery_assets.");
  process.exit(0);
}

console.log(`Total de imágenes: ${assets.length}\n`);

// Agrupa por alt_es normalizado
const groups = new Map();
for (const a of assets) {
  const key = (a.alt_es || "").trim().toLowerCase();
  if (!key) continue;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(a);
}

const isStorageUrl = (u) => /supabase\.co\/storage\//.test(u);
const isPublicUrl = (u) => u.startsWith("/");

let toDelete = [];
let groupsDuplicated = 0;
let groupsAmbiguous = 0;

for (const [keyName, items] of groups) {
  if (items.length < 2) continue;

  const storage = items.filter((i) => isStorageUrl(i.image_url));
  const pub = items.filter((i) => isPublicUrl(i.image_url));
  const other = items.filter(
    (i) => !isStorageUrl(i.image_url) && !isPublicUrl(i.image_url),
  );

  groupsDuplicated++;
  console.log(`◆ "${keyName}" (${items.length} copias)`);
  for (const i of items) {
    const origin = isStorageUrl(i.image_url)
      ? "Storage"
      : isPublicUrl(i.image_url)
        ? "/public"
        : "otro";
    console.log(`    [${origin.padEnd(7)}] ${i.image_url}`);
  }

  // Política 1: si hay Storage + /public/, borrar las de /public/
  if (storage.length >= 1 && pub.length >= 1 && other.length === 0) {
    for (const p of pub) toDelete.push(p);
    console.log(
      `    → Acción: eliminar ${pub.length} del seed (mantiene ${storage.length} en Storage)`,
    );
  }
  // Política 2: si todas son del mismo origen (todas /public/ o todas Storage)
  // pero tienen la MISMA URL exacta repetida, dejar solo la más antigua y borrar las copias.
  else {
    // Agrupa por image_url exacto
    const byUrl = new Map();
    for (const it of items) {
      if (!byUrl.has(it.image_url)) byUrl.set(it.image_url, []);
      byUrl.get(it.image_url).push(it);
    }

    let copiesDeleted = 0;
    let copiesKept = 0;
    const dropPreservingFirst = [];
    for (const [, rows] of byUrl) {
      // Si entre todas las copias hay alguna featured, conserva esa.
      // Si no, conserva la primera (más antigua porque ordenamos por created_at asc).
      const featured = rows.find((r) => r.featured);
      const keeper = featured ?? rows[0];
      copiesKept++;
      for (const r of rows) {
        if (r.id !== keeper.id) {
          dropPreservingFirst.push(r);
          copiesDeleted++;
        }
      }
    }

    if (copiesDeleted > 0) {
      for (const d of dropPreservingFirst) toDelete.push(d);
      console.log(
        `    → Acción: eliminar ${copiesDeleted} copias exactas (mantiene ${copiesKept} únicas)`,
      );
    } else {
      groupsAmbiguous++;
      console.log(
        `    → Acción: omitir (URLs distintas — revísalo manualmente desde el admin)`,
      );
    }
  }
  console.log("");
}

console.log("─────────────────────────────────");
console.log(`Grupos con duplicados: ${groupsDuplicated}`);
console.log(`Eliminaciones automáticas posibles: ${toDelete.length}`);
console.log(`Grupos ambiguos (revisión manual): ${groupsAmbiguous}`);

if (toDelete.length === 0) {
  console.log("\nNada que limpiar automáticamente.\n");
  process.exit(0);
}

if (!apply) {
  console.log(
    "\nEsto fue una simulación. Para aplicar los cambios:\n  npm run gallery-cleanup -- --apply\n",
  );
  process.exit(0);
}

console.log("\nEliminando…");
const ids = toDelete.map((d) => d.id);
const { error: delErr } = await sb
  .from("gallery_assets")
  .delete()
  .in("id", ids);

if (delErr) {
  console.error("❌ Error eliminando:", delErr.message);
  process.exit(1);
}

console.log(`✅ ${ids.length} imágenes eliminadas.\n`);
console.log("Refresca /admin/galeria y /galeria para ver el resultado.\n");
