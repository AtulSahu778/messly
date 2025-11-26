import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface SummaryTabProps {
  dailyCost: number;
  absentDates: string[];
  currentMonth: Date;
}

export const SummaryTab = ({ dailyCost, absentDates, currentMonth }: SummaryTabProps) => {
  const totalDaysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const daysAbsent = absentDates.filter(dateStr => {
    const date = new Date(dateStr);
    return (
      date.getMonth() === currentMonth.getMonth() &&
      date.getFullYear() === currentMonth.getFullYear()
    );
  }).length;

  const daysPresent = totalDaysInMonth - daysAbsent;
  const estimatedBill = daysPresent * dailyCost;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Today</h1>
          <p className="text-muted-foreground text-base">{formattedDate}</p>
        </div>

        {/* Bill Card */}
        <div className="ios-card p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Monthly Bill</p>
              <h2 className="text-3xl font-bold">₹{estimatedBill.toLocaleString()}</h2>
            </div>
          </div>
          <div className="pt-3 border-t border-ios-separator">
            <p className="text-sm text-muted-foreground">
              {daysPresent} days × ₹{dailyCost} per day
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold px-1">This Month</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {/* Total Days */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalDaysInMonth}</p>
                <p className="text-xs text-muted-foreground">Total Days</p>
              </div>
            </div>

            {/* Days Present */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{daysPresent}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>

            {/* Days Absent */}
            <div className="ios-card p-4 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{daysAbsent}</p>
                <p className="text-xs text-muted-foreground">Absent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="ios-card p-5 bg-accent/5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your bill is calculated based on the days you mark as present in the calendar. 
            By default, all days are marked as present.
          </p>
        </div>
      </div>
    </div>
  );
};
