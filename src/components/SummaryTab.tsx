import { Calendar, TrendingUp, TrendingDown, Utensils, Coffee } from 'lucide-react';
import { MonthSummary } from '@/types/mess';
import { memo } from 'react';

interface SummaryTabProps {
  summary: MonthSummary;
}

export const SummaryTab = memo(({ summary }: SummaryTabProps) => {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="px-2 pt-4 pb-24 sm:px-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Today</h1>
          <p className="text-muted-foreground text-base">{formattedDate}</p>
        </div>

        {/* Budget Overview Card */}
        <div className="ios-card p-5 sm:p-6 space-y-4">
          {/* Header row with month pill */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                Budget Overview
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                This month at a glance
              </p>
            </div>
            <div className="px-3 py-1 rounded-full bg-panel text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.16em]">
              {today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>

          {/* Main amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-panel/80 px-4 py-3 flex flex-col justify-center">
              <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                Total Budget
              </span>
              <span className="mt-1 text-xl sm:text-2xl font-semibold text-primary">
                ₹{summary.effectiveAdvance.toLocaleString()}
              </span>
            </div>

            <div className="rounded-2xl bg-panel/60 px-4 py-3 flex flex-col justify-center">
              <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                Spent So Far
              </span>
              <span className="mt-1 text-lg sm:text-xl font-semibold text-destructive">
                ₹{summary.totalSpent.toLocaleString()}
              </span>
            </div>

            <div className="rounded-2xl bg-panel/80 px-4 py-3 flex flex-col justify-center">
              <span className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.18em]">
                Remaining
              </span>
              <span
                className={`mt-1 text-xl sm:text-2xl font-semibold ${
                  summary.remaining >= 0 ? 'text-primary' : 'text-destructive'
                }`}
              >
                ₹{summary.remaining.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="pt-2 grid grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="rounded-xl bg-panel/50 px-3 py-2 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground text-[11px] uppercase tracking-[0.16em]">Carried from last month</p>
              <p className="font-semibold text-secondary mt-1 text-base">
                {summary.carriedFromPrevious > 0
                  ? `+₹${summary.carriedFromPrevious.toLocaleString()}`
                  : '₹0'}
              </p>
            </div>
            <div className="rounded-xl bg-panel/50 px-3 py-2 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground text-[11px] uppercase tracking-[0.16em]">Total days in month</p>
              <p className="font-semibold text-foreground mt-1 text-base">{summary.totalDaysInMonth}</p>
            </div>
          </div>
        </div>

        {/* Day-Based Statistics */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Day Statistics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Full Present Days */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Full Days
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.fullPresentDays}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                Approx. ₹{(summary.lunchCost * 2).toLocaleString()} per day
              </span>
            </div>

            {/* Half Days */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Half Days
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.halfDays}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                Approx. ₹{summary.lunchCost.toLocaleString()} per half day
              </span>
            </div>

            {/* Full Absent Days */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-destructive/10 flex items-center justify-center mb-2">
                <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Absent Days
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.fullAbsentDays}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                No charge on these days
              </span>
            </div>
          </div>
        </div>

        {/* Meal-Based Statistics */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1 text-foreground">Meal Statistics</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {/* Total Lunches */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Lunches
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.totalLunches}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                Rate: ₹{summary.lunchCost.toLocaleString()}
              </span>
            </div>

            {/* Total Dinners */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-2">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Dinners
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.totalDinners}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                Rate: ₹{summary.dinnerCost.toLocaleString()}
              </span>
            </div>

            {/* Total Meals */}
            <div className="ios-card p-4 sm:p-5 flex flex-col items-center justify-center text-center min-h-[90px]">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                <Utensils className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-[0.16em] leading-tight">
                Total Meals
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-1">
                {summary.totalMeals}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground leading-tight mt-1">
                Spent on meals: ₹{summary.totalSpent.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}

      </div>
    </div>
  );
});

SummaryTab.displayName = 'SummaryTab';
