
import { useState } from 'react';
import { Settings, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/hooks/useSettings';
import { useToast } from '@/hooks/use-toast';

const SettingsDialog = () => {
  const { dailyTarget, updateDailyTarget } = useSettings();
  const [tempTarget, setTempTarget] = useState(dailyTarget.toString());
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    const target = parseInt(tempTarget, 10);
    if (isNaN(target) || target < 1 || target > 20) {
      toast({
        title: "エラー",
        description: "目標は1〜20の範囲で設定してください",
        variant: "destructive",
      });
      return;
    }

    updateDailyTarget(target);
    setOpen(false);
    toast({
      title: "設定を保存しました",
      description: `1日の目標を${target}ポモドーロに設定しました`,
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setTempTarget(dailyTarget.toString());
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          設定
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            目標設定
          </DialogTitle>
          <DialogDescription>
            1日に完了したいポモドーロ数を設定してください
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="daily-target">1日の目標ポモドーロ数</Label>
            <Input
              id="daily-target"
              type="number"
              min="1"
              max="20"
              value={tempTarget}
              onChange={(e) => setTempTarget(e.target.value)}
              placeholder="8"
            />
            <p className="text-sm text-muted-foreground">
              推奨: 6〜10ポモドーロ（3〜5時間の集中作業）
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleSave}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
