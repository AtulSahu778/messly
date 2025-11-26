import { X, Coffee, Utensils } from 'lucide-react';
import { DayAttendance } from '@/types/mess';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@/components/ui/button';

interface CalendarTabProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  getAttendance: (dateString: string) => DayAttendance;
  toggleLunch: (dateString: string) => void;
  toggleDinner: (dateString: string) => void;
  setMealsForDate?: (dateString: string, isLunchPresent: boolean, isDinnerPresent: boolean) => Promise<void> | void;
}

export const CalendarTab = ({
  currentMonth,
  setCurrentMonth,
  getAttendance,
  toggleLunch,
  toggleDinner,
  setMealsForDate,
}: CalendarTabProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showHalfDayOptions, setShowHalfDayOptions] = useState(false);

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
    setShowHalfDayOptions(false);
    setTimeout(() => setSelectedDate(null), 200);
  };

  const handleSetBothPresent = async () => {
    if (!selectedDate) return;
    const current = getAttendance(selectedDate);

    // Preferred: atomic setter (Supabase/local aware)
    if (setMealsForDate) {
      await setMealsForDate(selectedDate, true, true);
      handleCloseDialog();
      return;
    }

    // Fallback: drive state to full present using individual toggles
    if (!current.isLunchPresent) {
      await toggleLunch(selectedDate);
    }
    if (!current.isDinnerPresent) {
      await toggleDinner(selectedDate);
    }

    handleCloseDialog();
  };

  const handleSetBothAbsent = async () => {
    if (!selectedDate) return;
    const current = getAttendance(selectedDate);

    if (setMealsForDate) {
      await setMealsForDate(selectedDate, false, false);
      handleCloseDialog();
      return;
    }

    if (current.isLunchPresent) {
      await toggleLunch(selectedDate);
    }
    if (current.isDinnerPresent) {
      await toggleDinner(selectedDate);
    }

    handleCloseDialog();
  };

  const handleLunchOnly = async () => {
    if (!selectedDate) return;
    const current = getAttendance(selectedDate);

    if (setMealsForDate) {
      await setMealsForDate(selectedDate, true, false);
      handleCloseDialog();
      return;
    }

    if (!current.isLunchPresent) {
      await toggleLunch(selectedDate);
    }
    if (current.isDinnerPresent) {
      await toggleDinner(selectedDate);
    }

    handleCloseDialog();
  };

  const handleDinnerOnly = async () => {
    if (!selectedDate) return;
    const current = getAttendance(selectedDate);

    if (setMealsForDate) {
      await setMealsForDate(selectedDate, false, true);
      handleCloseDialog();
      return;
    }

    if (current.isLunchPresent) {
      await toggleLunch(selectedDate);
    }
    if (!current.isDinnerPresent) {
      await toggleDinner(selectedDate);
    }

    handleCloseDialog();
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
    
    const bothPresent = attendance.isLunchPresent && attendance.isDinnerPresent;
    const bothAbsent = !attendance.isLunchPresent && !attendance.isDinnerPresent;
    const isHalfDay = !bothPresent && !bothAbsent;
    
    return (
      <div className="flex justify-center mt-1">
        {bothPresent && (
          <div className="w-2 h-2 rounded-full bg-[#30D158]" />
        )}
        {bothAbsent && (
          <div className="w-2 h-2 rounded-full bg-[#FF453A]" />
        )}
        {isHalfDay && (
          <div className="w-2 h-2 rounded-full bg-[#FFD60A]" />
        )}
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
      <div className="px-2 pt-4 pb-24 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <div className="ios-card p-2 sm:p-5 lg:p-8">
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
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none pb-20 sm:pb-0">
              <div 
                className="ios-card p-5 sm:p-6 w-full sm:max-w-sm sm:mx-4 pointer-events-auto animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 sm:rounded-3xl rounded-t-3xl max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Day {selectedDay}</h3>
                    <p className="text-sm text-muted-foreground">{selectedDateFormatted}</p>
                  </div>
                  <Button
                    type="button"
                    onClick={handleCloseDialog}
                    variant="ghost"
                    size="icon"
                    className="min-w-[44px] min-h-[44px] rounded-full bg-muted hover:bg-panel"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </Button>
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

                {/* Action Buttons - Simple iOS-style choices */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    onClick={handleSetBothAbsent}
                    variant="destructive"
                    className="w-full min-h-[48px] rounded-2xl text-[17px]"
                  >
                    Full Absent
                  </Button>

                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={() => setShowHalfDayOptions((prev) => !prev)}
                      variant="subtle"
                      className="w-full min-h-[48px] rounded-2xl text-[17px]"
                    >
                      Half Day
                    </Button>

                    {showHalfDayOptions && (
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          onClick={handleLunchOnly}
                          variant="subtle"
                          className="min-h-[44px] rounded-2xl text-[15px] flex items-center justify-center gap-2"
                        >
                          <Coffee className="w-4 h-4" />
                          Lunch Only
                        </Button>
                        <Button
                          type="button"
                          onClick={handleDinnerOnly}
                          variant="subtle"
                          className="min-h-[44px] rounded-2xl text-[15px] flex items-center justify-center gap-2"
                        >
                          <Utensils className="w-4 h-4" />
                          Dinner Only
                        </Button>
                      </div>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={handleSetBothPresent}
                    variant="primary"
                    className="w-full min-h-[48px] rounded-2xl text-[17px]"
                  >
                    Full Present
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
