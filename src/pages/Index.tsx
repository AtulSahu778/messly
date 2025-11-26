import { useState, useCallback } from 'react';
import { Home, Calendar, Settings } from 'lucide-react';
import { useMessDataWithSupabase } from '@/hooks/useMessDataWithSupabase';
import { SummaryTab } from '@/components/SummaryTab';
import { CalendarTab } from '@/components/CalendarTab';
import { SettingsTab } from '@/components/SettingsTab';
import { AuthScreen } from '@/components/AuthScreen';

type TabType = 'summary' | 'calendar' | 'settings';

const tabs = [
  { id: 'summary' as TabType, label: 'Summary', icon: Home },
  { id: 'calendar' as TabType, label: 'Manager', icon: Calendar },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  // Check localStorage for skipAuth preference
  const [skipAuth, setSkipAuth] = useState(() => {
    const stored = localStorage.getItem('messly-skip-auth');
    return stored === 'true';
  });
  const messData = useMessDataWithSupabase();

  // Save skipAuth preference
  const handleSkipAuth = () => {
    setSkipAuth(true);
    localStorage.setItem('messly-skip-auth', 'true');
  };

  const currentMonth = messData.currentMonth.getMonth() + 1;
  const currentYear = messData.currentMonth.getFullYear();

  const handleUpdateAdvance = useCallback((amount: number) => {
    messData.updateMonthlyAdvance(currentMonth, currentYear, amount);
  }, [messData.updateMonthlyAdvance, currentMonth, currentYear]);

  const handleUpdateMealCosts = useCallback((lunchCost: number, dinnerCost: number) => {
    messData.updateMealCosts(lunchCost, dinnerCost);
  }, [messData.updateMealCosts]);

  // Show auth screen if not authenticated and not skipped and Supabase is configured
  const hasSupabaseConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Debug logging
  console.log('Auth Check:', {
    hasUser: !!messData.user,
    skipAuth,
    isLoading: messData.isLoading,
    hasSupabaseConfig,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
  });
  
  if (!messData.user && !skipAuth && !messData.isLoading && hasSupabaseConfig) {
    return (
      <AuthScreen
        onSignIn={messData.signIn}
        onSignUp={messData.signUp}
        onSkip={() => setSkipAuth(true)}
      />
    );
  }

  // Show loading state
  if (messData.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'summary' && (
          <SummaryTab
            summary={messData.currentMonthSummary}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarTab
            currentMonth={messData.currentMonth}
            setCurrentMonth={messData.setCurrentMonth}
            getAttendance={messData.getAttendance}
            toggleLunch={messData.toggleLunch}
            toggleDinner={messData.toggleDinner}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            summary={messData.currentMonthSummary}
            onUpdateMealCosts={handleUpdateMealCosts}
            onUpdateAdvance={handleUpdateAdvance}
            resetData={messData.resetData}
            user={messData.user}
            onSignOut={messData.signOut}
          />
        )}
      </main>

      {/* Bottom Navigation Bar - iOS Style */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-ios-separator/[0.12] safe-bottom z-50">
        <div className="flex items-center justify-around min-h-[72px] max-w-2xl mx-auto px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 min-h-[56px] transition-all touch-manipulation active:scale-95 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
                aria-label={tab.label}
              >
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Index;
