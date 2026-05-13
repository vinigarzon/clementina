#!/usr/bin/env node
/**
 * Script de setup automático del admin de Finca La Clementina.
 *
 * Uso:
 *   npm run setup-admin -- tu@correo.com
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appDir = resolve(__dirname, "..");

// ---------- 1. Leer .env.local ----------
const envPath = resolve(appDir, ".env.local");
if (!existsSync(envPath)) {
  console.error("❌ No encontré .env.local en", envPath);
  process.exit(1);
}

const env = {};
const raw = readFileSync(envPath, "utf-8");
for (const rawLine of raw.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let value = line.slice(eq + 1).trim();
  // Quitar comillas envolventes simples o dobles
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  // Quitar trailing slash en URLs
  if (value.endsWith("/")) value = value.slice(0, -1);
  env[key] = value;
}

let SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || "";
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || "";

// ---------- 2. Diagnóstico de .env.local ----------
function mask(s, keep = 6) {
  if (!s) return "(vacío)";
  if (s.length <= keep * 2) return "*".repeat(s.length);
  return `${s.slice(0, keep)}…${s.slice(-keep)} (longitud ${s.length})`;
}

console.log("\n🌿 Setup de Finca La Clementina · admin\n");
console.log("Diagnóstico de .env.local:");
console.log("  NEXT_PUBLIC_SUPABASE_URL:    ", SUPABASE_URL || "(vacío)");
console.log("  SUPABASE_SERVICE_ROLE_KEY:   ", mask(SERVICE_KEY));
console.log("");

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// Validar URL
try {
  const u = new URL(SUPABASE_URL);
  if (!u.host.includes("supabase")) {
    console.warn(
      "⚠️  La URL no parece de Supabase (esperaba algo.supabase.co). Continuamos igual.",
    );
  }
  // Forzar protocolo https y reconstruir
  SUPABASE_URL = `${u.protocol}//${u.host}`;
} catch (e) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL no es una URL válida:", SUPABASE_URL);
  console.error("   Debe verse así: https://xxxxxxxx.supabase.co");
  process.exit(1);
}

// Validar service key (JWT tiene 3 segmentos separados por punto)
if (SERVICE_KEY.split(".").length !== 3) {
  console.error(
    "❌ SUPABASE_SERVICE_ROLE_KEY no parece un JWT válido (debería tener tres partes separadas por '.').",
  );
  console.error("   Vuelve a copiarla desde Supabase: Settings → API → service_role.");
  process.exit(1);
}

// ---------- 3. Argumentos ----------
const email = process.argv[2]?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("❌ Uso: npm run setup-admin -- tu@correo.com");
  process.exit(1);
}
console.log(`Email objetivo: ${email}\n`);

// ---------- 4. Cliente con service_role ----------
const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------- 5. Buscar el usuario ----------
console.log("[1/4] Buscando usuario en auth.users…");
const { data: usersResp, error: usersErr } = await supabase.auth.admin.listUsers({
  page: 1,
  perPage: 200,
});

if (usersErr) {
  console.error("❌ Error consultando usuarios:", usersErr.message);
  console.error("   Detalle:", usersErr);
  console.error("\n   Verifica que SUPABASE_SERVICE_ROLE_KEY es la key de");
  console.error("   'service_role' (no la 'anon public') y que la URL no");
  console.error("   tiene espacios ni caracteres extra.\n");

  // Plan B: probar con fetch directo para mostrar mejor error
  console.log("Intentando con fetch directo para diagnosticar…");
  const resp = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  });
  console.log("   HTTP status:", resp.status, resp.statusText);
  const text = await resp.text();
  console.log("   Body:", text.slice(0, 500));
  process.exit(1);
}

const user = usersResp.users.find((u) => u.email?.toLowerCase() === email);
if (!user) {
  console.error(`❌ No hay usuario con email "${email}".`);
  if (usersResp.users.length > 0) {
    console.error("   Usuarios existentes:");
    for (const u of usersResp.users) console.error("    -", u.email);
  } else {
    console.error("   (No hay ningún usuario creado en Authentication.)");
  }
  console.error(
    "\n   Crea el usuario en Supabase: Authentication → Users → Add user.",
  );
  process.exit(1);
}
console.log("    ✓ Encontrado:", user.email, "(id:", user.id, ")");

// ---------- 6. Asegurar profile super_admin ----------
console.log("\n[2/4] Verificando profile…");
const { data: profile, error: profileErr } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", user.id)
  .maybeSingle();

if (profileErr) {
  console.error("❌ Error leyendo profiles:", profileErr.message);
  console.error("   ¿Aplicaste la migración 0001_init.sql?");
  process.exit(1);
}

if (!profile) {
  const { error: insErr } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    role: "super_admin",
  });
  if (insErr) {
    console.error("❌ Error creando profile:", insErr.message);
    process.exit(1);
  }
  console.log("    ✓ Profile creado con role 'super_admin'");
} else if (profile.role !== "super_admin") {
  const { error: updErr } = await supabase
    .from("profiles")
    .update({ role: "super_admin" })
    .eq("id", user.id);
  if (updErr) {
    console.error("❌ Error promoviendo a super_admin:", updErr.message);
    process.exit(1);
  }
  console.log(`    ✓ Rol actualizado: '${profile.role}' → 'super_admin'`);
} else {
  console.log("    ✓ Profile ya existía con role 'super_admin'");
}

// ---------- 7. Bucket "media" ----------
console.log("\n[3/4] Verificando bucket de Storage…");
const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
if (bucketsErr) {
  console.warn("⚠️  No pude listar buckets:", bucketsErr.message);
} else {
  const has = buckets.some((b) => b.id === "media");
  if (has) {
    console.log("    ✓ Bucket 'media' ya existe");
  } else {
    const { error: createErr } = await supabase.storage.createBucket("media", {
      public: true,
    });
    if (createErr) {
      console.warn("⚠️  No pude crear bucket 'media':", createErr.message);
    } else {
      console.log("    ✓ Bucket 'media' creado (público)");
    }
  }
}

// ---------- 8. Seed gallery_assets ----------
console.log("\n[4/4] Verificando galería…");
const { count: galleryCount, error: countErr } = await supabase
  .from("gallery_assets")
  .select("*", { count: "exact", head: true });

if (countErr) {
  console.warn("⚠️  No pude contar gallery_assets:", countErr.message);
} else if (galleryCount && galleryCount > 0) {
  console.log(`    ✓ gallery_assets ya tiene ${galleryCount} filas`);
} else {
  const seed = [
    ["/venue/boda-clementina.jpg", "Boda en La Clementina", "Wedding at La Clementina", "Bodas", 1, true],
    ["/venue/ingreso.jpg", "Ingreso a la finca", "Venue entrance", "La Finca", 2, true],
    ["/real/banner-finca.jpg", "Vista general de la finca", "Venue overview", "La Finca", 3, false],
    ["/real/diseno-14.webp", "Detalle de la finca", "Venue detail", "La Finca", 4, false],
    ["/real/diseno-16.jpg", "Espacio decorado", "Decorated space", "La Finca", 5, false],
    ["/real/diseno-17.jpg", "Ambiente de evento", "Event ambience", "La Finca", 6, false],
    ["/real/diseno-18.jpg", "Decoración floral", "Floral decoration", "La Finca", 7, false],
    ["/real/diseno-19.jpg", "Salón principal", "Main hall", "La Finca", 8, false],
    ["/real/mishelle-byron.webp", "Boda Mishelle y Byron", "Mishelle and Byron wedding", "Bodas", 9, false],
    ["/real/mishelle-byron-boda.jpg", "Recepción Mishelle y Byron", "Mishelle and Byron reception", "Bodas", 10, false],
    ["/real/katherine-juandiego.webp", "Boda Katherine y Juan Diego", "Katherine and Juan Diego wedding", "Bodas", 11, false],
    ["/real/erick-dayana.webp", "Boda Erick y Dayana", "Erick and Dayana wedding", "Bodas", 12, false],
    ["/gallery/anillos.jpg", "Anillos de boda", "Wedding rings", "Bodas", 13, false],
    ["/gallery/bouquet.jpg", "Bouquet de novia", "Bridal bouquet", "Bodas", 14, false],
    ["/gallery/vestido.jpg", "Vestido de novia", "Wedding dress", "Bodas", 15, false],
    ["/gallery/ceremonia.jpg", "Ceremonia", "Ceremony", "Bodas", 16, false],
    ["/gallery/paseo.jpg", "Paseo de los novios", "Newlyweds stroll", "Bodas", 17, false],
    ["/real/ascenso-policia.webp", "Ascenso de policía", "Police promotion ceremony", "Corporativos", 18, false],
    ["/events/corporativos.jpg", "Evento corporativo", "Corporate event", "Corporativos", 19, false],
    ["/gallery/corporativo-2.jpg", "Reunión corporativa", "Corporate meeting", "Corporativos", 20, false],
    ["/real/aire-libre.webp", "Evento al aire libre", "Outdoor event", "Sociales", 21, false],
    ["/real/reunion-social.jpg", "Reunión social en la finca", "Social gathering", "Sociales", 22, false],
    ["/gallery/pinata.jpg", "Piñata", "Piñata moment", "Sociales", 23, false],
    ["/events/sociales.jpg", "Música y celebración", "Music and celebration", "Sociales", 24, false],
    ["/events/quinces.jpg", "Quince años", "Sweet fifteen", "Quinces", 25, false],
    ["/events/graduaciones.jpg", "Graduación", "Graduation", "Graduaciones", 26, false],
  ].map(([image_url, alt_es, alt_en, tag, sort_order, featured]) => ({
    image_url,
    alt_es,
    alt_en,
    tag,
    sort_order,
    featured,
    published: true,
  }));

  const { error: seedErr } = await supabase.from("gallery_assets").insert(seed);
  if (seedErr) {
    console.warn("⚠️  No pude cargar el seed de galería:", seedErr.message);
  } else {
    console.log(`    ✓ ${seed.length} imágenes cargadas en gallery_assets`);
  }
}

console.log("\n✅ Setup completo.\n");
console.log("Siguiente paso:");
console.log("  1. Si tienes npm run dev corriendo, déjalo así (hot reload).");
console.log("  2. En el navegador, borra cookies de localhost.");
console.log("  3. Ve a http://localhost:3000/admin y entra con tu email.\n");
