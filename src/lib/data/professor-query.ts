/** 교수 프로필 조회 — professor + professor_career (브라우저·서버 클라이언트 공용) */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Professor } from "@/types/content";
import { PROFESSOR_ID, buildProfessor } from "@/lib/data/mappers";

/**
 * DB의 교수 프로필. 행이 아직 없으면 null, 조회 실패 시 예외.
 * 호출하는 쪽에서 null일 때 시드 값으로 대체한다.
 */
export async function fetchProfessorWithClient(client: SupabaseClient): Promise<Professor | null> {
  const [profileRes, careerRes] = await Promise.all([
    client.from("professor").select("*").eq("id", PROFESSOR_ID).maybeSingle(),
    client
      .from("professor_career")
      .select("*")
      .eq("professor_id", PROFESSOR_ID)
      .order("sort_order", { ascending: true }),
  ]);

  if (profileRes.error) throw new Error(profileRes.error.message);
  if (careerRes.error) throw new Error(careerRes.error.message);

  return buildProfessor(
    profileRes.data as Record<string, unknown> | null,
    (careerRes.data ?? []) as Record<string, unknown>[]
  );
}
