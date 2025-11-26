import { ChevronLeft, ChevronRight, Coffee, Utensils, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DayAttendance } from '@/types/mess';
import { useState } from 'react';

interface CalendarTabProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  getAttendance: (dateString: string) => DayAttendance;
  toggleLunch: (dateString: string) => void;
  toggleDinner: (dateString: string) => void;
}

export const CalendarTab = ({
  currentMonth,
  setCurrentMonth,
  getAttendance,
  toggleLunch,
  toggleDinner,
}: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleDateClick = (dateString: string) => {
    setSelectedDate(dateString);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedDate(null), 200);
  };

  const handleToggleLunch = () => {
    if (selectedDate) {
      toggleLunch(selectedDate);
    }
  };

  const handleToggleDinner = () => {
    if (selectedDate) {
      toggleDinner(selectedDate);
    }
  };

  const handleSetBothPresent = () => {
    if (selectedDate) {
      const attendance = getAttendance(selectedDate);
      if (!attendance.isLunchPresent) toggleLunch(selectedDate);
      if (!attendance.isDinnerPresent) toggleDinner(selectedDate);
      handleCloseDialog();
    }
  };

  const handleSetBothAbsent = () => {
    if (selectedDate) {
      const attendance = getAttendance(selectedDate);
      if (attendance.isLunchPresent) toggleLunch(selectedDate);
      if (attendance.isDinnerPresent) toggleDinner(selectedDate);
      handleCloseDialog();
    }
  };

  const selectedAttendance = selectedDate ? getAttendance(selectedDate) : null;
  const selectedDay = selectedDate ? new Date(selectedDate).getDate() : null;
  const selectedDateFormatted = selectedDate 
    ? new Date(selectedDate).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      })
    : '';

  const getDayClass = (day: number) => {
    const dateString = new Date(year, month, day).toISOString().split('T')[0];
    const attendance = getAttendance(dateString);
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
    
    const bothPresent = attendance.isLunchPresent && attendance.isDinnerPresent;
    const bothAbsent = !attendance.isLunchPresent && !attendance.isDinnerPresent;

    let classes = 'w-full aspect-square rounded-2xl lg:rounded-3xl flex flex-col items-center justify-center font-semibold text-base lg:text-lg transition-all touch-manipulation p-2 lg:p-3 relative hover:scale-105 active:scale-95';
    
    if (isToday && bothPresent) {
      classes += ' bg-primary text-primary-foreground shadow-lg';
    } else if (bothAbsent) {
      classes += ' bg-destructive/10 text-destructive hover:bg-destructive/20';
    } else if (bothPresent) {
      classes += ' bg-card text-foreground hover:bg-panel shadow-sm';
    } else {
      classes += ' bg-secondary/10 text-foreground hover:bg-panel';
    }

    return classes;
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      if (i < firstDayOfMonth || i >= firstDayOfMonth + daysInMonth) {
        days.push(<div key={i} className="aspect-square" />);
      } else {
        const day = i - firstDayOfMonth + 1;
        const dateString = new Date(year, month, day).toISOString().split('T')[0];
        const attendance = getAttendance(dateString);
        
        days.push(
          <button
            key={i}
            onClick={() => handleDateClick(dateString)}
            className={getDayClass(day)}
          >
            <span className="text-base lg:text-xl font-bold mb-2 lg:mb-3">{day}</span>
            <div className="flex gap-1 lg:gap-1.5">
              <div
                className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center ${
                  attendance.isLunchPresent 
                    ? 'bg-secondary shadow-sm' 
                    : 'bg-destructive/20 border border-destructive'
                }`}
              >
                {attendance.isLunchPresent && (
                  <Coffee className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary-foreground" />
                )}
              </div>
              <div
                className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full flex items-center justify-center ${
                  attendance.isDinnerPresent 
                    ? 'bg-secondary shadow-sm' 
                    : 'bg-destructive/20 border border-destructive'
                }`}
              >
                {attendance.isDinnerPresent && (
                  <Utensils className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary-foreground" />
                )}
              </div>
            </div>
          </button>
        );
      }
    }

    return days;
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{monthName}</h1>
          <div className="flex gap-2">
            <Button
              onClick={goToPreviousMonth}
              variant="ghost"
              size="icon"
              className="min-w-[44px] min-h-[44px] lg:min-w-[48px] lg:min-h-[48px] rounded-xl hover:bg-panel"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
            </Button>
            <Button
              onClick={goToNextMonth}
              variant="ghost"
              size="icon"
              className="min-w-[44px] min-h-[44px] lg:min-w-[48px] lg:min-h-[48px] rounded-xl hover:bg-panel"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="ios-card p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 lg:gap-3 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-xs sm:text-sm lg:text-base font-semibold text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 lg:gap-3">
                {renderCalendarDays()}
              </div>
            </div>
          </div>

          {/* Legend - Sidebar on desktop */}
          <div className="lg:col-span-1">
            <div className="ios-card p-4 sm:p-5 lg:p-6 space-y-4 lg:sticky lg:top-6">
              <h3 className="font-semibold text-base lg:text-lg text-foreground">How to Use</h3>
              <div className="space-y-4">
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Click any date to manage lunch and dinner attendance:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-secondary shadow-sm flex items-center justify-center">
                        <Coffee className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary-foreground" />
                      </div>
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-secondary shadow-sm flex items-center justify-center">
                        <Utensils className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary-foreground" />
                      </div>
                    </div>
                    <span className="text-sm lg:text-base text-muted-foreground">Both meals present</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-secondary shadow-sm flex items-center justify-center">
                        <Coffee className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary-foreground" />
                      </div>
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-destructive/20 border border-destructive" />
                    </div>
                    <span className="text-sm lg:text-base text-muted-foreground">Only lunch present</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-destructive/20 border border-destructive" />
                      <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-destructive/20 border border-destructive" />
                    </div>
                    <span className="text-sm lg:text-base text-muted-foreground">Both meals absent</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-ios-separator/[0.12]">
                  <p className="text-xs lg:text-sm text-muted-foreground mb-3">Quick reference:</p>
                  <div className="flex items-center gap-2 text-sm lg:text-base text-foreground">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-secondary shadow-sm flex items-center justify-center">
                      <Coffee className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary-foreground" />
                    </div>
                    <span>= Lunch</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm lg:text-base text-foreground mt-2">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-secondary shadow-sm flex items-center justify-center">
                      <Utensils className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary-foreground" />
                    </div>
                    <span>= Dinner</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Dialog */}
        {isDialogOpen && selectedAttendance && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
              onClick={handleCloseDialog}
            />
            
            {/* Dialog */}
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
              <div 
                className="ios-card p-5 sm:p-6 w-full sm:max-w-sm sm:mx-4 pointer-events-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 sm:rounded-3xl rounded-t-3xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Day {selectedDay}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDateFormatted}</p>
                  </div>
                  <button
                    onClick={handleCloseDialog}
                    className="min-w-[44px] min-h-[44px] rounded-full bg-muted hover:bg-panel flex items-center justify-center transition-colors"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Current Status */}
                <div className="mb-6 p-4 bg-panel rounded-2xl">
                  <p className="text-xs text-muted-foreground mb-2">Current Status</p>
                  <div className="flex gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedAttendance.isLunchPresent 
                          ? 'bg-secondary' 
                          : 'bg-destructive/20 border-2 border-destructive'
                      }`}>
                        {selectedAttendance.isLunchPresent && (
                          <Coffee className="w-3.5 h-3.5 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-foreground">Lunch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedAttendance.isDinnerPresent 
                          ? 'bg-secondary' 
                          : 'bg-destructive/20 border-2 border-destructive'
                      }`}>
                        {selectedAttendance.isDinnerPresent && (
                          <Utensils className="w-3.5 h-3.5 text-primary-foreground" />
                        )}
                      </div>
                      <span className="text-sm text-foreground">Dinner</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleToggleLunch}
                    className={`w-full min-h-[52px] px-5 py-3.5 rounded-2xl font-semibold text-[17px] transition-all active:scale-98 flex items-center justify-center gap-3 ${
                      selectedAttendance.isLunchPresent
                        ? 'bg-destructive/10 text-destructive border-2 border-destructive/30'
                        : 'bg-secondary/10 text-secondary border-2 border-secondary/30'
                    }`}
                  >
                    <Coffee className="w-5 h-5" />
                    {selectedAttendance.isLunchPresent ? 'Mark Lunch Absent' : 'Mark Lunch Present'}
                  </button>

                  <button
                    onClick={handleToggleDinner}
                    className={`w-full min-h-[52px] px-5 py-3.5 rounded-2xl font-semibold text-[17px] transition-all active:scale-98 flex items-center justify-center gap-3 ${
                      selectedAttendance.isDinnerPresent
                        ? 'bg-destructive/10 text-destructive border-2 border-destructive/30'
                        : 'bg-secondary/10 text-secondary border-2 border-secondary/30'
                    }`}
                  >
                    <Utensils className="w-5 h-5" />
                    {selectedAttendance.isDinnerPresent ? 'Mark Dinner Absent' : 'Mark Dinner Present'}
                  </button>

                  <div className="pt-2 border-t border-ios-separator/[0.12] space-y-2">
                    <button
                      onClick={handleSetBothPresent}
                      className="w-full min-h-[52px] px-5 py-3.5 rounded-2xl font-semibold text-[17px] bg-primary text-primary-foreground transition-all active:scale-98"
                    >
                      Mark Both Present
                    </button>
                    <button
                      onClick={handleSetBothAbsent}
                      className="w-full min-h-[52px] px-5 py-3.5 rounded-2xl font-semibold text-[17px] bg-destructive text-destructive-foreground transition-all active:scale-98"
                    >
                      Mark Both Absent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
