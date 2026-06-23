import type { SiteContent } from "@/types/content";
import { loadContent, saveContent, seedContent } from "@/lib/data/seed";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export async function fetchSiteContent(): Promise<SiteContent> {
  if (!isSupabaseConfigured()) {
    return loadContent();
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("payload")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      console.error("[fetchSiteContent]", error.message);
      return seedContent;
    }

    if (!data?.payload) {
      return seedContent;
    }

    return data.payload as SiteContent;
  } catch (err) {
    console.error("[fetchSiteContent]", err);
    return seedContent;
  }
}

export async function persistSiteContent(content: SiteContent): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveContent(content);
    return;
  }

  const supabase = createClient();
  const { error } = await supabase.from("site_content").upsert({
    id: "default",
    payload: content,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}
