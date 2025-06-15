
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyTarget, setDailyTarget] = useState<number>(8);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // 取得
  const fetchDailyTarget = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("daily_targets")
      .select("daily_target")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      // エラーは初回のみ許容（未登録の場合）
      setLoading(false);
      setInitialized(true);
      return;
    }
    if (data?.daily_target) {
      setDailyTarget(data.daily_target);
    }
    setLoading(false);
    setInitialized(true);
  }, [user]);

  // 保存
  const updateDailyTarget = useCallback(
    async (target: number) => {
      if (!user) return;
      // 既存がないならinsert, あればupdate
      const { error, status } = await supabase
        .from("daily_targets")
        .upsert(
          {
            user_id: user.id,
            daily_target: target,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      if (error) {
        toast({
          title: "エラー",
          description: "データベースへの保存に失敗しました",
          variant: "destructive",
        });
        throw error;
      }
      setDailyTarget(target);
      // ローカルStateのみset。fetch不要
      return status;
    },
    [user, toast]
  );

  useEffect(() => {
    if (user && !initialized) {
      fetchDailyTarget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, fetchDailyTarget]);

  return {
    dailyTarget,
    updateDailyTarget,
    loading,
    refetch: fetchDailyTarget,
  };
};
