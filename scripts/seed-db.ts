/**
 * 샘플 데이터를 Supabase에 시드
 * .env.local: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (권장)
 * 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY + SUPABASE_ADMIN_EMAIL/PASSWORD (로그인 후 쓰기)
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { seedContent } from "../src/lib/data/seed";
import {
  careerToRows,
  flattenMembers,
  galleryToRow,
  memberRecordToRow,
  newsToRow,
  patentToRow,
  professorToRow,
  publicationToRow,
} from "../src/lib/data/mappers";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").replace(/^\uFEFF/, "");
    const env: Record<string, string> = {};
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
    return env;
  } catch {
    return {};
  }
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || (!serviceKey && !anonKey)) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (또는 ANON_KEY) 필요");
  process.exit(1);
}

const sb = createClient(url, serviceKey ?? anonKey!, {
  auth: { persistSession: false, autoRefreshToken: false },
});

if (!serviceKey) {
  const email = env.SUPABASE_ADMIN_EMAIL;
  const password = env.SUPABASE_ADMIN_PASSWORD;
  if (!email || !password) {
    console.error("❌ SUPABASE_SERVICE_ROLE_KEY 또는 SUPABASE_ADMIN_EMAIL/PASSWORD 필요");
    process.exit(1);
  }
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("❌ 로그인 실패:", error.message);
    process.exit(1);
  }
  console.log("✅ Supabase Auth 로그인 OK");
}

const content = structuredClone(seedContent);

for (const table of ["news", "publications", "gallery", "patents", "members"] as const) {
  const { error } = await sb.from(table).delete().gte("id", 1);
  if (error) throw new Error(`${table} delete: ${error.message}`);
}

const inserts = [
  ["news", content.news.map((item) => newsToRow(item))],
  ["publications", content.publications.map((item) => publicationToRow(item))],
  ["gallery", content.gallery.map((item) => galleryToRow(item))],
  ["patents", content.patents.map((item) => patentToRow(item))],
] as const;

for (const [table, rows] of inserts) {
  if (rows.length === 0) continue;
  const { error } = await sb.from(table).insert(rows);
  if (error) throw new Error(`${table} insert: ${error.message}`);
  console.log(`✅ ${table}: ${rows.length} rows`);
}

const memberRows = flattenMembers(content.members).map(memberRecordToRow);
if (memberRows.length > 0) {
  const { error } = await sb.from("members").insert(memberRows);
  if (error) throw new Error(`members insert: ${error.message}`);
  console.log(`✅ members: ${memberRows.length} rows`);
}

// 교수 프로필: save_professor()는 is_admin()을 요구해 service role(auth.uid() 없음)로는
// 호출할 수 없으므로 두 테이블에 직접 쓴다.
{
  const professor = content.members.professor;
  const { error: profError } = await sb.from("professor").upsert(professorToRow(professor));
  if (profError) throw new Error(`professor upsert: ${profError.message}`);

  const { error: delError } = await sb.from("professor_career").delete().eq("professor_id", "default");
  if (delError) throw new Error(`professor_career delete: ${delError.message}`);

  const careerRows = careerToRows(professor);
  if (careerRows.length > 0) {
    const { error } = await sb.from("professor_career").insert(careerRows);
    if (error) throw new Error(`professor_career insert: ${error.message}`);
  }
  console.log(`✅ professor: 1 row, professor_career: ${careerRows.length} rows`);
}

console.log("\n시드 완료.");
