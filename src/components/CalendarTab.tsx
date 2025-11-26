import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarTabProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  isDateAbsent: (dateString: string) => boolean;
  toggleAbsentDate: (dateString: string) => void;
}

export const CalendarTab = ({
  currentMonth,
  setCurrentMonth,
  isDateAbsent,
  toggleAbsentDate,
}: CalendarTabProps) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const getDayClass = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    const isAbsent = isDateAbsent(dateString);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

    let classes = 'aspect-square rounded-2xl flex items-center justify-center font-semibold text-base transition-all active:scale-95 touch-manipulation min-h-[44px]';
    
    if (isToday && !isAbsent) {
      classes += ' bg-primary text-primary-foreground shadow-md';
    } else if (isAbsent) {
      classes += ' bg-destructive/10 text-destructive line-through';
    } else {
      classes += ' bg-card text-foreground hover:bg-accent/5';
    }

    return classes;
  };

  const handleDayClick = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    toggleAbsentDate(dateString);
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth || i >= firstDayOfMonth + daysInMonth) {
        days.push(<div key={i} className="aspect-square" />);
      } else {
        const day = i - firstDayOfMonth + 1;
        days.push(
          <button
            key={i}
            onClick={() => handleDayClick(day)}
            className={getDayClass(day)}
          >
            {day}
          </button>
        );
      }
    }

    return days;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-6 space-y-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{monthName}</h1>
          <div className="flex gap-2">
            <Button
              onClick={goToPreviousMonth}
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={goToNextMonth}
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-xl"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Calendar */}
        <div className="ios-card p-5 space-y-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Legend */}
        <div className="ios-card p-5 space-y-3">
          <h3 className="font-semibold text-sm">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary" />
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-card border-2 border-ios-separator" />
              <span className="text-sm text-muted-foreground">Present (Default)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <span className="text-xs line-through text-destructive font-semibold">15</span>
              </div>
              <span className="text-sm text-muted-foreground">Absent (Tap to toggle)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
