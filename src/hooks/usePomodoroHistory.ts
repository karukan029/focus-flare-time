
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PomodoroSession {
  id: string;
  date: string;
  completed_count: number;
  total_work_minutes: number;
}

export const usePomodoroHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todaySession, setTodaySession] = useState<PomodoroSession | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // 今日のセッションを取得
  const fetchTodaySession = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('今日のセッション取得エラー:', error);
        return;
      }

      setTodaySession(data);
    } catch (error) {
      console.error('今日のセッション取得エラー:', error);
    }
  };

  // ポモドーロ完了時にデータベースを更新
  const updatePomodoroSession = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      if (todaySession) {
        // 既存のセッションを更新
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .update({
            completed_count: todaySession.completed_count + 1,
            total_work_minutes: todaySession.total_work_minutes + 25,
            updated_at: new Date().toISOString()
          })
          .eq('id', todaySession.id)
          .select()
          .single();

        if (error) {
          console.error('セッション更新エラー:', error);
          return;
        }

        setTodaySession(data);
      } else {
        // 新しいセッションを作成
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .insert({
            user_id: user.id,
            date: today,
            completed_count: 1,
            total_work_minutes: 25
          })
          .select()
          .single();

        if (error) {
          console.error('セッション作成エラー:', error);
          return;
        }

        setTodaySession(data);
      }
    } catch (error) {
      console.error('セッション更新エラー:', error);
    }
  };

  // 履歴を取得
  const fetchHistory = async (): Promise<PomodoroSession[]> => {
    if (!user) return [];

    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30);

      if (error) {
        console.error('履歴取得エラー:', error);
        toast({
          title: "エラー",
          description: "履歴の取得に失敗しました。",
          variant: "destructive"
        });
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('履歴取得エラー:', error);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaySession();
  }, [user]);

  return {
    todaySession,
    updatePomodoroSession,
    fetchHistory,
    historyLoading,
    refetchTodaySession: fetchTodaySession
  };
};
