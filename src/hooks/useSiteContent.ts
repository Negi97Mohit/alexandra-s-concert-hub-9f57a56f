import { useEffect } from "react";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DEFAULT_CONTENT, mergeContent, type SiteContent } from "@/lib/site-content";

export const SITE_CONTENT_KEY = ["site-content"] as const;

export async function fetchSiteContent(): Promise<SiteContent> {
  const { data, error } = await supabase
    .from("site_content")
    .select("data")
    .eq("id", "singleton")
    .maybeSingle();

  if (error) return DEFAULT_CONTENT;
  return mergeContent(data?.data);
}

let subscribed = false;

function ensureRealtime(queryClient: QueryClient) {
  if (subscribed || typeof window === "undefined") return;
  subscribed = true;
  supabase
    .channel("site-content-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "site_content" },
      () => {
        void queryClient.invalidateQueries({ queryKey: SITE_CONTENT_KEY });
      },
    )
    .subscribe();
}

/** Live website content: defaults first, then whatever the admin has saved. */
export function useSiteContent(): SiteContent {
  const queryClient = useQueryClient();

  useEffect(() => {
    ensureRealtime(queryClient);
  }, [queryClient]);

  const { data } = useQuery({
    queryKey: SITE_CONTENT_KEY,
    queryFn: fetchSiteContent,
    initialData: DEFAULT_CONTENT,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

  return data ?? DEFAULT_CONTENT;
}
