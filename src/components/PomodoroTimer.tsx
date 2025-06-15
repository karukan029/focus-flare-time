
import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'work' | 'break';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const workDuration = 25 * 60; // 25 minutes
  const breakDuration = 5 * 60; // 5 minutes
  
  const currentDuration = mode === 'work' ? workDuration : breakDuration;
  const progress = ((currentDuration - timeLeft) / currentDuration) * 100;

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

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (mode === 'work') {
      setCompletedPomodoros(prev => prev + 1);
      setMode('break');
      setTimeLeft(breakDuration);
      toast({
        title: "作業時間完了！",
        description: "お疲れ様でした。5分間の休憩を取りましょう。",
      });
    } else {
      setMode('work');
      setTimeLeft(workDuration);
      toast({
        title: "休憩時間完了！",
        description: "次のポモドーロを始めましょう。",
      });
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-lg p-8 bg-card/80 backdrop-blur-sm border-2 border-primary/20">
        <div className="text-center space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-primary">ポモドーロタイマー</h1>
            <p className="text-muted-foreground">
              集中して作業し、適度に休憩を取りましょう
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={mode === 'work' ? 'default' : 'ghost'}
              onClick={() => switchMode('work')}
              className="flex-1 gap-2"
            >
              <Zap className="w-4 h-4" />
              作業時間
            </Button>
            <Button
              variant={mode === 'break' ? 'default' : 'ghost'}
              onClick={() => switchMode('break')}
              className="flex-1 gap-2"
            >
              <Coffee className="w-4 h-4" />
              休憩時間
            </Button>
          </div>

          {/* Timer Display */}
          <div className={`relative ${isRunning ? 'timer-active' : ''}`}>
            <div className="text-8xl font-bold text-primary timer-glow">
              {formatTime(timeLeft)}
            </div>
            <div className="text-lg text-muted-foreground mt-2">
              {mode === 'work' ? '作業中' : '休憩中'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-3"
            />
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% 完了
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={toggleTimer}
              size="lg"
              className="gap-2 px-8"
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
              className="gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              リセット
            </Button>
          </div>

          {/* Stats */}
          <div className="pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {completedPomodoros}
              </div>
              <div className="text-sm text-muted-foreground">
                完了したポモドーロ
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
