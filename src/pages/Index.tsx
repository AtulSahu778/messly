import { useState } from 'react';
import { Home, Calendar, Settings } from 'lucide-react';
import { useMessData } from '@/hooks/useMessData';
import { SummaryTab } from '@/components/SummaryTab';
import { CalendarTab } from '@/components/CalendarTab';
import { SettingsTab } from '@/components/SettingsTab';

type TabType = 'summary' | 'calendar' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const messData = useMessData();

  const tabs = [
    { id: 'summary' as TabType, label: 'Summary', icon: Home },
    { id: 'calendar' as TabType, label: 'Manager', icon: Calendar },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'summary' && (
          <SummaryTab
            dailyCost={messData.dailyCost}
            absentDates={messData.absentDates}
            currentMonth={messData.currentMonth}
          />
        )}
        {activeTab === 'calendar' && (
          <CalendarTab
            currentMonth={messData.currentMonth}
            setCurrentMonth={messData.setCurrentMonth}
            isDateAbsent={messData.isDateAbsent}
            toggleAbsentDate={messData.toggleAbsentDate}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            dailyCost={messData.dailyCost}
            setDailyCost={messData.setDailyCost}
            resetData={messData.resetData}
          />
        )}
      </main>

      {/* Bottom Navigation Bar - iOS Style */}
      <nav className="fixed bottom-0 left-0 right-0 glass-effect border-t border-ios-separator safe-bottom z-50">
        <div className="flex items-center justify-around h-20 max-w-2xl mx-auto px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all touch-manipulation active:scale-95 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className={`w-7 h-7 transition-transform ${isActive ? 'scale-110' : ''}`} />
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
