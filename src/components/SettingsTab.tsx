import { Coffee, Utensils, RotateCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect, memo, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { MonthSummary } from '@/types/mess';

interface SettingsTabProps {
  summary: MonthSummary;
  onUpdateMealCosts: (lunchCost: number, dinnerCost: number) => void;
  onUpdateAdvance: (amount: number) => void;
  resetData: () => void;
  user?: any;
  onSignOut?: () => void;
}

export const SettingsTab = memo(({ summary, onUpdateMealCosts, onUpdateAdvance, resetData, user, onSignOut }: SettingsTabProps) => {
  const [lunchCost, setLunchCost] = useState(summary.lunchCost.toString());
  const [dinnerCost, setDinnerCost] = useState(summary.dinnerCost.toString());
  const [advanceInput, setAdvanceInput] = useState(summary.advanceGiven.toString());
  
  const advanceTimeoutRef = useRef<NodeJS.Timeout>();
  const lunchTimeoutRef = useRef<NodeJS.Timeout>();
  const dinnerTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLunchCost(summary.lunchCost.toString());
    setDinnerCost(summary.dinnerCost.toString());
    setAdvanceInput(summary.advanceGiven.toString());
  }, [summary.lunchCost, summary.dinnerCost, summary.advanceGiven, summary.month, summary.year]);

  // Cleanup timeouts and save pending changes on unmount
  useEffect(() => {
    return () => {
      // Save any pending changes before unmount
      if (advanceTimeoutRef.current) {
        clearTimeout(advanceTimeoutRef.current);
        const numValue = parseFloat(advanceInput);
        if (!isNaN(numValue) && numValue >= 0) {
          onUpdateAdvance(numValue);
        }
      }
      if (lunchTimeoutRef.current) {
        clearTimeout(lunchTimeoutRef.current);
        const numValue = parseFloat(lunchCost);
        if (!isNaN(numValue) && numValue >= 0) {
          onUpdateMealCosts(numValue, parseFloat(dinnerCost) || 0);
        }
      }
      if (dinnerTimeoutRef.current) {
        clearTimeout(dinnerTimeoutRef.current);
        const numValue = parseFloat(dinnerCost);
        if (!isNaN(numValue) && numValue >= 0) {
          onUpdateMealCosts(parseFloat(lunchCost) || 0, numValue);
        }
      }
    };
  }, [advanceInput, lunchCost, dinnerCost, onUpdateAdvance, onUpdateMealCosts]);

  const handleLunchCostChange = useCallback((value: string) => {
    setLunchCost(value);
    
    if (lunchTimeoutRef.current) {
      clearTimeout(lunchTimeoutRef.current);
    }
    
    lunchTimeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdateMealCosts(numValue, parseFloat(dinnerCost) || 0);
        toast.success('Lunch cost updated');
      }
    }, 500);
  }, [dinnerCost, onUpdateMealCosts]);

  const handleDinnerCostChange = useCallback((value: string) => {
    setDinnerCost(value);
    
    if (dinnerTimeoutRef.current) {
      clearTimeout(dinnerTimeoutRef.current);
    }
    
    dinnerTimeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdateMealCosts(parseFloat(lunchCost) || 0, numValue);
        toast.success('Dinner cost updated');
      }
    }, 500);
  }, [lunchCost, onUpdateMealCosts]);

  const handleAdvanceChange = useCallback((value: string) => {
    setAdvanceInput(value);
    
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    
    advanceTimeoutRef.current = setTimeout(() => {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onUpdateAdvance(numValue);
        toast.success('Monthly advance updated');
      }
    }, 800);
  }, [onUpdateAdvance]);

  const handleAdvanceBlur = useCallback(() => {
    // Save immediately on blur
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
    }
    const numValue = parseFloat(advanceInput);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdateAdvance(numValue);
    }
  }, [advanceInput, onUpdateAdvance]);

  const handleReset = useCallback(() => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetData();
      setLunchCost('50');
      setDinnerCost('50');
      setAdvanceInput('0');
      toast.success('All data has been reset');
    }
  }, [resetData]);

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your mess preferences</p>
        </div>

        {/* Monthly Advance */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Monthly Budget</h3>
          
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Monthly Advance</p>
                <p className="text-sm text-muted-foreground">Advance given this month</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                ₹
              </span>
              <Input
                type="number"
                value={advanceInput}
                onChange={(e) => handleAdvanceChange(e.target.value)}
                onBlur={handleAdvanceBlur}
                className="min-h-[52px] pl-9 pr-4 text-[17px] font-semibold rounded-2xl border-2 focus:border-primary transition-colors"
                placeholder="Enter monthly advance"
                min="0"
                step="100"
              />
            </div>
          </div>
        </div>

        {/* Meal Costs */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Meal Rates</h3>
          
          {/* Lunch Cost */}
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Lunch Cost</p>
                <p className="text-sm text-muted-foreground">Cost per lunch meal</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                ₹
              </span>
              <Input
                type="number"
                value={lunchCost}
                onChange={(e) => handleLunchCostChange(e.target.value)}
                className="min-h-[52px] pl-9 pr-4 text-[17px] font-semibold rounded-2xl border-2 focus:border-primary transition-colors"
                placeholder="Enter lunch cost"
                min="0"
                step="1"
              />
            </div>
          </div>

          {/* Dinner Cost */}
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Dinner Cost</p>
                <p className="text-sm text-muted-foreground">Cost per dinner meal</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                ₹
              </span>
              <Input
                type="number"
                value={dinnerCost}
                onChange={(e) => handleDinnerCostChange(e.target.value)}
                className="min-h-[52px] pl-9 pr-4 text-[17px] font-semibold rounded-2xl border-2 focus:border-primary transition-colors"
                placeholder="Enter dinner cost"
                min="0"
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Current Month Summary */}
        <div className="ios-card p-5 bg-panel space-y-3">
          <h4 className="font-semibold text-sm text-foreground">Current Month Calculation</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lunches consumed:</span>
              <span className="text-foreground font-semibold">
                {summary.totalLunches} × ₹{summary.lunchCost} = ₹{summary.totalLunches * summary.lunchCost}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dinners consumed:</span>
              <span className="text-foreground font-semibold">
                {summary.totalDinners} × ₹{summary.dinnerCost} = ₹{summary.totalDinners * summary.dinnerCost}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-ios-separator/[0.12]">
              <span className="text-foreground font-semibold">Total Spent:</span>
              <span className="text-destructive font-bold">₹{summary.totalSpent}</span>
            </div>
          </div>
        </div>

        {/* Reset Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Data Management</h3>
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Reset All Data</p>
                <p className="text-sm text-muted-foreground">Clear all attendance and advance records</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full min-h-[52px] px-5 py-3.5 text-[17px] font-semibold rounded-2xl"
            >
              Reset Everything
            </Button>
          </div>
        </div>



        {/* Account Section */}
        {user && onSignOut && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold px-1 text-foreground">Account</h3>
            <div className="ios-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Signed In</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={onSignOut}
                variant="outline"
                className="w-full min-h-[48px] px-4 py-2.5 text-[17px] font-semibold rounded-xl"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Version */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            {user ? '☁️ Cloud Sync Enabled' : '💾 Local Storage Only'}
          </p>
          <p className="text-xs text-muted-foreground">
            Built by Atul
          </p>
        </div>
      </div>
    </div>
  );
});

SettingsTab.displayName = 'SettingsTab';
