
import { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePomodoroHistory } from '@/hooks/usePomodoroHistory';

interface PomodoroSession {
  id: string;
  date: string;
  completed_count: number;
  total_work_minutes: number;
}

const PomodoroHistory = () => {
  const { fetchHistory, historyLoading } = usePomodoroHistory();
  const [history, setHistory] = useState<PomodoroSession[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadHistory = async () => {
    const data = await fetchHistory();
    setHistory(data);
    setShowHistory(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(date);
  };

  const getTotalStats = () => {
    const totalPomodoros = history.reduce((sum, session) => sum + session.completed_count, 0);
    const totalMinutes = history.reduce((sum, session) => sum + session.total_work_minutes, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return {
      totalPomodoros,
      totalTime: `${totalHours}時間${remainingMinutes}分`,
      averagePerDay: history.length > 0 ? Math.round(totalPomodoros / history.length * 10) / 10 : 0
    };
  };

  if (!showHistory) {
    return (
      <div className="text-center">
        <Button
          onClick={loadHistory}
          variant="outline"
          className="gap-2"
          disabled={historyLoading}
        >
          <TrendingUp className="w-4 h-4" />
          {historyLoading ? '読み込み中...' : '履歴を表示'}
        </Button>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalPomodoros}</div>
          <div className="text-sm text-muted-foreground">総ポモドーロ数</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalTime}</div>
          <div className="text-sm text-muted-foreground">総作業時間</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stats.averagePerDay}</div>
          <div className="text-sm text-muted-foreground">1日平均</div>
        </Card>
      </div>

      {/* 履歴一覧 */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          活動履歴
        </h3>
        
        {history.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            まだ履歴がありません。ポモドーロを開始してみましょう！
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {history.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{formatDate(session.date)}</div>
                    <div className="text-sm text-muted-foreground">
                      {session.date === new Date().toISOString().split('T')[0] && '今日'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-primary">
                      {session.completed_count}
                    </div>
                    <div className="text-muted-foreground">ポモドーロ</div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{Math.floor(session.total_work_minutes / 60)}h {session.total_work_minutes % 60}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="text-center">
        <Button
          onClick={() => setShowHistory(false)}
          variant="ghost"
          size="sm"
        >
          履歴を閉じる
        </Button>
      </div>
    </div>
  );
};

export default PomodoroHistory;
