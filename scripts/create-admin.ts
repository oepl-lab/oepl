/**
 * 관리자 계정 생성 — 이메일 발송 없이 (초대/인증 메일이 안 갈 때 쓰는 경로)
 * .env.local: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 * 사용: npm run admin:create -- someone@ulsan.ac.kr '비밀번호'
 *
 * email_confirm: true로 만들기 때문에 Supabase가 확인 메일을 보내지 않는다.
 * 계정이 이미 있으면 비밀번호를 재설정하고 이메일을 확인 처리한다.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8").replace(/^﻿/, "");
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

if (!url || !serviceKey) {
  console.error("❌ .env.local에 NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 필요");
  process.exit(1);
}

const email = (process.argv[2] ?? env.SUPABASE_ADMIN_EMAIL ?? "").trim();
const password = process.argv[3] ?? env.SUPABASE_ADMIN_PASSWORD ?? "";
const note = process.argv[4] ?? "연구실 관리자";

if (!email || !password) {
  console.error("❌ 사용: npm run admin:create -- <이메일> <비밀번호> [메모]");
  process.exit(1);
}

const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** listUsers에는 이메일 조회가 없어서 페이지를 훑는다. */
async function findUserByEmail(target: string) {
  const wanted = target.toLowerCase();
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw new Error(`listUsers: ${error.message}`);
    const hit = data.users.find((u) => u.email?.toLowerCase() === wanted);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

const existing = await findUserByEmail(email);
let userId: string;

if (existing) {
  const { error } = await sb.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  if (error) {
    console.error("❌ 계정 갱신 실패:", error.message);
    process.exit(1);
  }
  userId = existing.id;
  console.log("✅ 기존 계정 비밀번호 재설정 + 이메일 확인 처리:", email);
} else {
  const { data, error } = await sb.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    console.error("❌ 계정 생성 실패:", error?.message ?? "no user returned");
    process.exit(1);
  }
  userId = data.user.id;
  console.log("✅ 계정 생성 (확인 메일 발송 없음):", email);
}

const { error: adminError } = await sb
  .from("admin_users")
  .upsert({ user_id: userId, email, note }, { onConflict: "user_id" });

if (adminError) {
  console.error("❌ admin_users 등록 실패:", adminError.message);
  process.exit(1);
}

console.log("✅ admin_users 등록 완료 — /login 에서 바로 로그인 가능");
