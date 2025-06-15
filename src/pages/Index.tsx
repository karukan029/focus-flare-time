
import PomodoroTimer from '@/components/PomodoroTimer';
import UserProfile from '@/components/UserProfile';
import AuthGuard from '@/components/AuthGuard';

const Index = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-xl font-semibold text-gray-900">ポモドーロタイマー</h1>
              <UserProfile />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PomodoroTimer />
        </main>
      </div>
    </AuthGuard>
  );
};

export default Index;
