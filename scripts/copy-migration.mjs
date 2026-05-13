#!/usr/bin/env node
/**
 * Copia un archivo de migración SQL al portapapeles del Mac
 * y abre el SQL Editor de Supabase en el navegador.
 *
 * Uso:
 *   npm run copy-migration -- 0003
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync, spawn } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "..");
const migrationsDir = resolve(appDir, "supabase/migrations");

const arg = process.argv[2]?.trim();
if (!arg) {
  console.error("❌ Uso: npm run copy-migration -- 0003");
  console.error("\nMigraciones disponibles:");
  for (const f of readdirSync(migrationsDir).sort()) {
    console.error(" -", f);
  }
  process.exit(1);
}

// Encuentra el archivo (acepta solo el número, o el nombre completo)
const files = readdirSync(migrationsDir);
const target = files.find(
  (f) => f === arg || f.startsWith(arg + "_") || f === `${arg}.sql`,
);
if (!target) {
  console.error(`❌ No encontré migración "${arg}".`);
  console.error("Disponibles:");
  for (const f of files.sort()) console.error(" -", f);
  process.exit(1);
}

const filepath = resolve(migrationsDir, target);
const sql = readFileSync(filepath, "utf-8");

// Copiar al portapapeles (macOS: pbcopy)
try {
  const child = spawn("pbcopy");
  child.stdin.write(sql);
  child.stdin.end();
  await new Promise((res) => child.on("close", res));
  console.log(`✅ Copiado al portapapeles: ${target}`);
  console.log(`   (${sql.length} caracteres, ${sql.split("\n").length} líneas)`);
} catch (e) {
  console.warn("⚠️  No pude copiar al portapapeles:", e.message);
  console.log("   Abre el archivo manualmente:", filepath);
}

// Intenta abrir el SQL Editor de Supabase
const envPath = resolve(appDir, ".env.local");
if (existsSync(envPath)) {
  const env = {};
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"](.+)['"]$/, "$1");
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  if (url) {
    const projectRef = url.replace(/^https?:\/\//, "").split(".")[0];
    const editorUrl = `https://supabase.com/dashboard/project/${projectRef}/sql/new`;
    console.log(`\nAbriendo: ${editorUrl}`);
    try {
      execSync(`open "${editorUrl}"`);
    } catch {
      console.log("(no pude abrirlo automáticamente, ábrelo manualmente)");
    }
  }
}

console.log("\nQué hacer ahora:");
console.log("  1. En el SQL Editor que se abre, pega con Cmd+V.");
console.log("  2. Click en 'Run' (esquina inferior derecha o Cmd+Enter).");
console.log("  3. Si todo sale bien, verás 'Success. No rows returned'.");
