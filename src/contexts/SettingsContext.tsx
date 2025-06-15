
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type SettingsContextType = {
  dailyTarget: number;
  setDailyTarget: (num: number) => void;
  loading: boolean;
  refetch: () => Promise<void>;
  updateDailyTarget: (target: number) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  dailyTarget: 8,
  setDailyTarget: () => {},
  loading: false,
  refetch: async () => {},
  updateDailyTarget: async () => {},
});

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyTarget, setDailyTarget] = useState<number>(8);
  const [loading, setLoading] = useState(true);

  const fetchDailyTarget = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("daily_targets")
      .select("daily_target")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      setLoading(false);
      return;
    }
    if (data?.daily_target) {
      setDailyTarget(data.daily_target);
    }
    setLoading(false);
  }, [user]);

  const updateDailyTarget = useCallback(
    async (target: number) => {
      if (!user) return;
      const { error } = await supabase
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
    },
    [user, toast]
  );

  useEffect(() => {
    fetchDailyTarget();
  }, [user, fetchDailyTarget]);

  return (
    <SettingsContext.Provider
      value={{ dailyTarget, setDailyTarget, loading, refetch: fetchDailyTarget, updateDailyTarget }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
