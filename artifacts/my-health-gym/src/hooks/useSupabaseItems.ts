import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured, type Item } from "../lib/supabase";

export function useSupabaseItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);

  const fetchItems = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      setIsLive(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from("items")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setItems(data);
        setIsLive(true);
        setError(null);
      } else {
        // Table exists but is empty
        setIsLive(false);
      }
    } catch (err: unknown) {
      console.warn("Supabase fetch warning (falling back to local data):", err);
      setError(err instanceof Error ? err.message : "Failed to fetch items from Supabase");
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();

    if (!isSupabaseConfigured()) {
      return undefined;
    }

    // Subscribe to real-time changes
    const channel = supabase
      .channel("public:items")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "items" },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  return { items, loading, error, isLive, refetch: fetchItems };
}
