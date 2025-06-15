
import PomodoroTimer from '@/components/PomodoroTimer';
import UserProfile from '@/components/UserProfile';
import AuthGuard from '@/components/AuthGuard';
import { SettingsProvider } from '@/contexts/SettingsContext';

const Index = () => {
  return (
    <AuthGuard>
      <SettingsProvider>
        <div className="min-h-screen bg-background">
          <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="flex justify-between items-center h-14 sm:h-16">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground">ポモドーロタイマー</h1>
                <UserProfile />
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
            <PomodoroTimer />
          </main>
        </div>
      </SettingsProvider>
    </AuthGuard>
  );
};

export default Index;
