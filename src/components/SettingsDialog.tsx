
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
import { useSettingsDialog } from '@/hooks/useSettingsDialog';

const SettingsDialog = () => {
  const { state, handlers } = useSettingsDialog();
  const { handleSave, handleOpenChange, handleTargetChange, handleClose } = handlers;


  return (
    <Dialog open={state.open} onOpenChange={handleOpenChange}>
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
              value={state.tempTarget}
              onChange={(e) => handleTargetChange(e.target.value)}
              placeholder="8"
              className={!state.isValid ? 'border-red-500' : ''}
            />
            {state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}
            <p className="text-sm text-muted-foreground">
              推奨: 6〜10ポモドーロ（3〜5時間の集中作業）
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            キャンセル
          </Button>
          <Button onClick={handleSave} disabled={!state.isValid}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
