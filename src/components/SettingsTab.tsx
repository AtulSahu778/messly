import { DollarSign, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface SettingsTabProps {
  dailyCost: number;
  setDailyCost: (cost: number) => void;
  resetData: () => void;
}

export const SettingsTab = ({ dailyCost, setDailyCost, resetData }: SettingsTabProps) => {
  const [inputValue, setInputValue] = useState(dailyCost.toString());

  const handleCostChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setDailyCost(numValue);
      toast.success('Daily cost updated');
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetData();
      setInputValue('100');
      toast.success('All data has been reset');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your mess preferences</p>
        </div>

        {/* Daily Cost Setting */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Mess Rate</h3>
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Daily Cost</p>
                <p className="text-sm text-muted-foreground">Cost per day of meals</p>
              </div>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">
                ₹
              </span>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => handleCostChange(e.target.value)}
                className="h-14 pl-9 pr-4 text-lg font-semibold rounded-2xl border-2 focus:border-primary transition-colors"
                placeholder="Enter daily cost"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              This rate will be used to calculate your monthly mess bill
            </p>
          </div>
        </div>

        {/* Reset Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">Data Management</h3>
          <div className="ios-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center">
                <RotateCcw className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Reset All Data</p>
                <p className="text-sm text-muted-foreground">Clear all absent dates and settings</p>
              </div>
            </div>
            <Button
              onClick={handleReset}
              variant="destructive"
              className="w-full h-14 text-base font-semibold rounded-2xl"
            >
              Reset Everything
            </Button>
          </div>
        </div>

        {/* Info Card */}
        <div className="ios-card p-5 bg-accent/5 space-y-2">
          <h4 className="font-semibold text-sm">About This App</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mess Manager helps you track your mess attendance and calculate monthly bills. 
            All data is stored locally on your device and never sent to any server.
          </p>
        </div>

        {/* Version */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};
