import { Coffee, Utensils, X } from 'lucide-react';
import { DayAttendance } from '@/types/mess';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

  const handleDateClick = (date: Date) => {
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    setSelectedDate(dateString);
    setIsDialogOpen(true);
  };

  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    if (activeStartDate) {
      setCurrentMonth(activeStartDate);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setSelectedDate(null), 200);
  };

  const handleToggleLunch = async () => {
    if (selectedDate) {
      await toggleLunch(selectedDate);
      // Force re-render by updating state
      setIsDialogOpen(false);
      setTimeout(() => {
        setIsDialogOpen(true);
      }, 50);
    }
  };

  const handleToggleDinner = async () => {
    if (selectedDate) {
      await toggleDinner(selectedDate);
      // Force re-render by updating state
      setIsDialogOpen(false);
      setTimeout(() => {
        setIsDialogOpen(true);
      }, 50);
    }
  };

  const handleSetBothPresent = async () => {
    if (selectedDate) {
      const attendance = getAttendance(selectedDate);
      // Toggle lunch if absent
      if (!attendance.isLunchPresent) {
        await toggleLunch(selectedDate);
      }
      // Toggle dinner if absent
      if (!attendance.isDinnerPresent) {
        await toggleDinner(selectedDate);
      }
      // Wait a bit for state to update, then close
      setTimeout(() => {
        handleCloseDialog();
      }, 300);
    }
  };

  const handleSetBothAbsent = async () => {
    if (selectedDate) {
      const attendance = getAttendance(selectedDate);
      // Toggle lunch if present
      if (attendance.isLunchPresent) {
        await toggleLunch(selectedDate);
      }
      // Toggle dinner if present
      if (attendance.isDinnerPresent) {
        await toggleDinner(selectedDate);
      }
      // Wait a bit for state to update, then close
      setTimeout(() => {
        handleCloseDialog();
      }, 300);
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

  const getTileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const attendance = getAttendance(dateString);
    
    return (
      <div className="flex gap-0.5 justify-center mt-1">
        <div
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex items-center justify-center ${
            attendance.isLunchPresent 
              ? 'bg-secondary' 
              : 'bg-destructive/40'
          }`}
        />
        <div
          className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex items-center justify-center ${
            attendance.isDinnerPresent 
              ? 'bg-secondary' 
              : 'bg-destructive/40'
          }`}
        />
      </div>
    );
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    // Use local date to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const attendance = getAttendance(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    
    const bothPresent = attendance.isLunchPresent && attendance.isDinnerPresent;
    const bothAbsent = !attendance.isLunchPresent && !attendance.isDinnerPresent;

    if (isToday && bothPresent) return 'today-present';
    if (bothAbsent) return 'both-absent';
    if (bothPresent) return 'both-present';
    return 'partial';
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="ios-card p-3 sm:p-5 lg:p-8">
              <Calendar
                value={currentMonth}
                onClickDay={handleDateClick}
                onActiveStartDateChange={handleActiveStartDateChange}
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                className="messly-calendar"
                locale="en-US"
              />
            </div>
          </div>

          {/* Legend - Sidebar on desktop, hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="ios-card p-5 lg:p-6 space-y-4 lg:sticky lg:top-6">
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
                <div className="space-y-2">
                  <button
                    onClick={handleToggleLunch}
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-base transition-all active:scale-98 flex items-center justify-center gap-2 ${
                      selectedAttendance.isLunchPresent
                        ? 'bg-destructive/10 text-destructive border-2 border-destructive/30'
                        : 'bg-secondary/10 text-secondary border-2 border-secondary/30'
                    }`}
                  >
                    <Coffee className="w-4 h-4" />
                    {selectedAttendance.isLunchPresent ? 'Mark Lunch Absent' : 'Mark Lunch Present'}
                  </button>

                  <button
                    onClick={handleToggleDinner}
                    className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-base transition-all active:scale-98 flex items-center justify-center gap-2 ${
                      selectedAttendance.isDinnerPresent
                        ? 'bg-destructive/10 text-destructive border-2 border-destructive/30'
                        : 'bg-secondary/10 text-secondary border-2 border-secondary/30'
                    }`}
                  >
                    <Utensils className="w-4 h-4" />
                    {selectedAttendance.isDinnerPresent ? 'Mark Dinner Absent' : 'Mark Dinner Present'}
                  </button>

                  <div className="pt-2 border-t border-ios-separator/[0.12] space-y-2">
                    <button
                      onClick={handleSetBothAbsent}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-base bg-destructive text-destructive-foreground transition-all active:scale-98"
                    >
                      Mark Both Absent
                    </button>
                    <button
                      onClick={handleSetBothPresent}
                      className="w-full min-h-[48px] px-4 py-2.5 rounded-xl font-semibold text-base bg-primary text-primary-foreground transition-all active:scale-98"
                    >
                      Mark Both Present
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
