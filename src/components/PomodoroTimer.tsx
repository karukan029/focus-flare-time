import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { usePomodoroHistory } from '@/hooks/usePomodoroHistory';
import TodayProgress from './TodayProgress';
import PomodoroHistory from './PomodoroHistory';

type TimerMode = 'work' | 'break';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const { todaySession, updatePomodoroSession, refetchTodaySession } = usePomodoroHistory();

  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes
  
  const currentDuration = mode === 'work' ? workDuration : breakDuration;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

  // 今日のセッションから完了済みポモドーロ数を同期
  useEffect(() => {
    if (todaySession) {
      setCompletedPomodoros(todaySession.completed_count);
    }
  }, [todaySession]);

  // 通知許可を確認・要求
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          setNotificationsEnabled(permission === 'granted');
        });
      }
    }
  }, []);

  // デスクトップ通知を表示する関数
  const showNotification = (title: string, body: string) => {
    if (notificationsEnabled && 'Notification' in window) {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
      
      // 通知をクリックしたときにアプリケーションにフォーカスを当てる
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = async () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      // ポモドーロ完了時にDBを更新
      await updatePomodoroSession();
      // 今日のセッションを再取得
      await refetchTodaySession();
      
      setCompletedPomodoros(prev => prev + 1);
      setMode('break');
      setTimeLeft(breakDuration);
      
      // トーストとデスクトップ通知
      toast({
        title: "作業時間完了！",
        description: "お疲れ様でした。5分間の休憩を取りましょう。",
      });
      
      showNotification(
        "ポモドーロタイマー - 作業時間完了！",
        "お疲れ様でした。5分間の休憩を取りましょう。"
      );
    } else {
      setMode('work');
      setTimeLeft(workDuration);
      
      // トーストとデスクトップ通知
      toast({
        title: "休憩時間完了！",
        description: "次のポモドーロを始めましょう。",
      });
      
      showNotification(
        "ポモドーロタイマー - 休憩時間完了！",
        "次のポモドーロを始めましょう。"
      );
    }

    // Play notification sound (if available)
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAUGKS8');
      audio.play().catch(() => {
        // Silently fail if audio playback is not available
      });
    } catch (error) {
      // Ignore audio errors
    }
  };

  // 通知許可を要求する関数
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        setNotificationsEnabled(permission === 'granted');
        if (permission === 'granted') {
          toast({
            title: "通知が有効になりました",
            description: "タイマー終了時にデスクトップ通知が表示されます。",
          });
        }
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(currentDuration);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workDuration : breakDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 pt-6 sm:p-4 sm:pt-8">
      <div className="w-full max-w-md sm:max-w-lg space-y-4 sm:space-y-6">
        {/* 今日の進捗 */}
        <TodayProgress />

        {/* メインタイマー */}
        <Card className="p-5 sm:p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-md">
          <div className="text-center space-y-5 sm:space-y-8">
            {/* Header */}
            <div className="space-y-1.5 sm:space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">ポモドーロタイマー</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                集中して作業し、適度に休憩を取りましょう
              </p>
              
              {/* 通知設定 */}
              {!notificationsEnabled && 'Notification' in window && (
                <Button
                  onClick={requestNotificationPermission}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Bell className="w-4 h-4" />
                  通知を有効にする
                </Button>
              )}
            </div>

            {/* Mode Selector */}
            <div className="flex gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={mode === 'work' ? 'default' : 'ghost'}
                onClick={() => switchMode('work')}
                className="flex-1 gap-2 text-xs sm:text-base py-2 sm:py-3"
              >
                <Zap className="w-4 h-4" />
                作業時間
              </Button>
              <Button
                variant={mode === 'break' ? 'default' : 'ghost'}
                onClick={() => switchMode('break')}
                className="flex-1 gap-2 text-xs sm:text-base py-2 sm:py-3"
              >
                <Coffee className="w-4 h-4" />
                休憩時間
              </Button>
            </div>

            {/* Timer Display */}
            <div className={`relative ${isRunning ? 'timer-active' : ''}`}>
              <div className="text-6xl sm:text-8xl font-bold text-primary timer-glow break-words">
                {formatTime(timeLeft)}
              </div>
              <div className="text-base sm:text-lg text-muted-foreground mt-2">
                {mode === 'work' ? '作業中' : '休憩中'}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 sm:space-y-2">
              <Progress 
                value={progress} 
                className="h-2 sm:h-3"
              />
              <div className="text-xs sm:text-sm text-muted-foreground">
                {Math.round(progress)}% 完了
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 sm:gap-4 justify-center flex-wrap">
              <Button
                onClick={toggleTimer}
                size="lg"
                className="gap-2 px-7 sm:px-8 text-sm sm:text-base"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    一時停止
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    開始
                  </>
                )}
              </Button>
              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
                className="gap-2 text-sm sm:text-base"
              >
                <RotateCcw className="w-5 h-5" />
                リセット
              </Button>
            </div>
          </div>
        </Card>

        {/* 履歴セクション */}
        <PomodoroHistory />
      </div>
    </div>
  );
};

export default PomodoroTimer;
