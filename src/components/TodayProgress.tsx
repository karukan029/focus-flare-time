
import { Calendar, Clock, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePomodoroHistory } from '@/hooks/usePomodoroHistory';

const TodayProgress = () => {
  const { todaySession } = usePomodoroHistory();

  const todayTarget = 8; // 1日の目標ポモドーロ数
  const completedCount = todaySession?.completed_count || 0;
  const totalMinutes = todaySession?.total_work_minutes || 0;
  const progressPercentage = Math.min((completedCount / todayTarget) * 100, 100);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        今日の進捗
      </h2>
      
      <div className="space-y-4">
        {/* プログレスバー */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>目標まで</span>
            <span>{completedCount}/{todayTarget} ポモドーロ</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* 統計 */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{completedCount}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Target className="w-3 h-3" />
              完了
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-primary">{formatTime(totalMinutes)}</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              作業時間
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-primary">
              {todayTarget - completedCount > 0 ? todayTarget - completedCount : 0}
            </div>
            <div className="text-xs text-muted-foreground">残り</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TodayProgress;
