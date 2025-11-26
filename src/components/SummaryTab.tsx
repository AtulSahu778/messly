import { Calendar, TrendingUp, TrendingDown, Utensils, Coffee } from 'lucide-react';
import { MonthSummary } from '@/types/mess';
import { Input } from '@/components/ui/input';
import { useState, useEffect, memo } from 'react';

interface SummaryTabProps {
  summary: MonthSummary;
  onUpdateAdvance: (amount: number) => void;
}

export const SummaryTab = memo(({ summary, onUpdateAdvance }: SummaryTabProps) => {
  const [advanceInput, setAdvanceInput] = useState(summary.advanceGiven.toString());

  useEffect(() => {
    setAdvanceInput(summary.advanceGiven.toString());
  }, [summary.advanceGiven, summary.month, summary.year]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleAdvanceChange = (value: string) => {
    setAdvanceInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdateAdvance(numValue);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Today</h1>
          <p className="text-muted-foreground text-base">{formattedDate}</p>
        </div>

        {/* Advance Input Card */}
        <div className="ios-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Advance Given This Month</p>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-semibold">
                  ₹
                </span>
                <Input
                  type="number"
                  value={advanceInput}
                  onChange={(e) => handleAdvanceChange(e.target.value)}
                  className="min-h-[52px] pl-8 pr-4 text-[17px] font-semibold"
                  placeholder="0"
                  min="0"
                  step="100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Budget Overview Card */}
        <div className="ios-card p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Budget Overview</h3>
          
          <div className="space-y-3">
            {/* Carried Forward */}
            {summary.carriedFromPrevious > 0 && (
              <div className="flex items-center justify-between py-2 border-b border-ios-separator/[0.12]">
                <span className="text-sm text-muted-foreground">Carried From Last Month</span>
                <span className="text-base font-semibold text-secondary">
                  +₹{summary.carriedFromPrevious.toLocaleString()}
                </span>
              </div>
            )}
            
            {/* Total Budget */}
            <div className="flex items-center justify-between py-2 border-b border-ios-separator/[0.12]">
              <span className="text-sm font-semibold text-foreground">Total Budget</span>
              <span className="text-xl font-bold text-primary">
                ₹{summary.effectiveAdvance.toLocaleString()}
              </span>
            </div>
            
            {/* Total Spent */}
            <div className="flex items-center justify-between py-2 border-b border-ios-separator/[0.12]">
              <span className="text-sm text-muted-foreground">Total Spent</span>
              <span className="text-base font-semibold text-destructive">
                -₹{summary.totalSpent.toLocaleString()}
              </span>
            </div>
            
            {/* Remaining */}
            <div className="flex items-center justify-between py-3 bg-panel rounded-2xl px-4">
              <span className="text-sm font-semibold text-foreground">Remaining Balance</span>
              <span className={`text-2xl font-bold ${summary.remaining >= 0 ? 'text-primary' : 'text-destructive'}`}>
                ₹{summary.remaining.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Meal Stats Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Meal Statistics</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Total Lunches */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.totalLunches}</p>
                <p className="text-xs text-muted-foreground">Lunches</p>
                <p className="text-xs text-muted-foreground mt-1">₹{summary.lunchCost} each</p>
              </div>
            </div>

            {/* Total Dinners */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.totalDinners}</p>
                <p className="text-xs text-muted-foreground">Dinners</p>
                <p className="text-xs text-muted-foreground mt-1">₹{summary.dinnerCost} each</p>
              </div>
            </div>

            {/* Both Meals */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.daysWithBothMeals}</p>
                <p className="text-xs text-muted-foreground">Both Meals</p>
              </div>
            </div>

            {/* Days Absent */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{summary.daysAbsent}</p>
                <p className="text-xs text-muted-foreground">Days Absent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}

      </div>
    </div>
  );
});

SummaryTab.displayName = 'SummaryTab';
