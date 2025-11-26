import { useState, useEffect, useMemo, useCallback } from 'react';
import { MessData, DayAttendance, MonthlyRecord, MonthSummary } from '@/types/mess';

const STORAGE_KEY = 'messly-data-v2';

const getDefaultMonthlyRecord = (month: number, year: number): MonthlyRecord => ({
  month,
  year,
  advanceGiven: 0,
  carriedFromPrevious: 0,
  lunchCost: 50,
  dinnerCost: 50,
});

export const useMessData = () => {
  const [attendance, setAttendance] = useState<DayAttendance[]>([]);
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: MessData = JSON.parse(stored);
        setAttendance(data.attendance || []);
        setMonthlyRecords(data.monthlyRecords || []);
        setCurrentMonth(data.currentMonth ? new Date(data.currentMonth) : new Date());
      }
    } catch (e) {
      setAttendance([]);
      setMonthlyRecords([]);
      setCurrentMonth(new Date());
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, []);

  // Save data to localStorage whenever it changes (skip initial load)
  useEffect(() => {
    if (isInitialLoad) return;
    
    const data: MessData = {
      attendance,
      monthlyRecords,
      currentMonth,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [attendance, monthlyRecords, currentMonth, isInitialLoad]);

  // Calculate carry forward from previous month (not a hook, just a helper function)
  const calculateCarryForward = (month: number, year: number): number => {
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    
    const prevRecord = monthlyRecords.find(r => r.month === prevMonth && r.year === prevYear);
    if (!prevRecord) return 0;
    
    const prevAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() + 1 === prevMonth && date.getFullYear() === prevYear;
    });
    
    let prevLunches = 0;
    let prevDinners = 0;
    prevAttendance.forEach(a => {
      if (a.isLunchPresent) prevLunches++;
      if (a.isDinnerPresent) prevDinners++;
    });
    
    const prevSpent = (prevLunches * prevRecord.lunchCost) + (prevDinners * prevRecord.dinnerCost);
    const prevEffective = prevRecord.advanceGiven + prevRecord.carriedFromPrevious;
    const prevRemaining = prevEffective - prevSpent;
    
    return Math.max(prevRemaining, 0);
  };

  // Calculate summary for a specific month (not a hook, just a helper function)
  const calculateMonthSummary = (month: number, year: number): MonthSummary => {
    // Get existing record or use defaults (without recursion)
    const existingRecord = monthlyRecords.find(r => r.month === month && r.year === year);
    const record = existingRecord || getDefaultMonthlyRecord(month, year);
    
    // Get all attendance for this month
    const monthAttendance = attendance.filter(a => {
      const date = new Date(a.date);
      return date.getMonth() + 1 === month && date.getFullYear() === year;
    });

    // Count meals
    let totalLunches = 0;
    let totalDinners = 0;
    let daysWithBothMeals = 0;
    let daysWithOnlyLunch = 0;
    let daysWithOnlyDinner = 0;

    monthAttendance.forEach(a => {
      if (a.isLunchPresent) totalLunches++;
      if (a.isDinnerPresent) totalDinners++;
      
      if (a.isLunchPresent && a.isDinnerPresent) daysWithBothMeals++;
      else if (a.isLunchPresent) daysWithOnlyLunch++;
      else if (a.isDinnerPresent) daysWithOnlyDinner++;
    });

    const totalDaysInMonth = new Date(year, month, 0).getDate();
    const daysAbsent = totalDaysInMonth - monthAttendance.length;

    const totalSpent = (totalLunches * record.lunchCost) + (totalDinners * record.dinnerCost);
    const effectiveAdvance = record.advanceGiven + record.carriedFromPrevious;
    const remaining = effectiveAdvance - totalSpent;

    return {
      month,
      year,
      advanceGiven: record.advanceGiven,
      carriedFromPrevious: record.carriedFromPrevious,
      effectiveAdvance,
      totalLunches,
      totalDinners,
      lunchCost: record.lunchCost,
      dinnerCost: record.dinnerCost,
      totalSpent,
      remaining,
      totalDaysInMonth,
      daysWithBothMeals,
      daysWithOnlyLunch,
      daysWithOnlyDinner,
      daysAbsent,
    };
  };

  // Get current month summary with carry forward calculation
  const currentMonthSummary = useMemo(() => {
    const month = currentMonth.getMonth() + 1;
    const year = currentMonth.getFullYear();
    
    let record = monthlyRecords.find(r => r.month === month && r.year === year);
    if (!record) {
      const carriedFromPrevious = calculateCarryForward(month, year);
      record = {
        ...getDefaultMonthlyRecord(month, year),
        carriedFromPrevious,
      };
    }
    
    return calculateMonthSummary(month, year);
  }, [currentMonth, monthlyRecords, attendance]);

  // Get attendance for a specific date
  const getAttendance = useCallback((dateString: string): DayAttendance => {
    const existing = attendance.find(a => a.date === dateString);
    return existing || { date: dateString, isLunchPresent: true, isDinnerPresent: true };
  }, [attendance]);

  // Toggle lunch attendance
  const toggleLunch = useCallback((dateString: string) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.date === dateString);
      if (existing) {
        return prev.map(a => 
          a.date === dateString 
            ? { ...a, isLunchPresent: !a.isLunchPresent }
            : a
        );
      }
      return [...prev, { date: dateString, isLunchPresent: false, isDinnerPresent: true }];
    });
  }, []);

  // Toggle dinner attendance
  const toggleDinner = useCallback((dateString: string) => {
    setAttendance(prev => {
      const existing = prev.find(a => a.date === dateString);
      if (existing) {
        return prev.map(a => 
          a.date === dateString 
            ? { ...a, isDinnerPresent: !a.isDinnerPresent }
            : a
        );
      }
      return [...prev, { date: dateString, isLunchPresent: true, isDinnerPresent: false }];
    });
  }, []);

  // Update monthly advance
  const updateMonthlyAdvance = useCallback((month: number, year: number, advanceGiven: number) => {
    setMonthlyRecords(prev => {
      const existing = prev.find(r => r.month === month && r.year === year);
      if (existing) {
        return prev.map(r => 
          r.month === month && r.year === year
            ? { ...r, advanceGiven }
            : r
        );
      }
      
      const carriedFromPrevious = calculateCarryForward(month, year);
      
      return [...prev, {
        month,
        year,
        advanceGiven,
        carriedFromPrevious,
        lunchCost: 50,
        dinnerCost: 50,
      }];
    });
  }, [attendance, monthlyRecords]);

  // Update meal costs for a month
  const updateMealCosts = useCallback((month: number, year: number, lunchCost: number, dinnerCost: number) => {
    setMonthlyRecords(prev => {
      const existing = prev.find(r => r.month === month && r.year === year);
      if (existing) {
        return prev.map(r => 
          r.month === month && r.year === year
            ? { ...r, lunchCost, dinnerCost }
            : r
        );
      }
      return [...prev, {
        ...getDefaultMonthlyRecord(month, year),
        lunchCost,
        dinnerCost,
      }];
    });
  }, []);

  const resetData = useCallback(() => {
    setAttendance([]);
    setMonthlyRecords([]);
    setCurrentMonth(new Date());
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    attendance,
    monthlyRecords,
    currentMonth,
    setCurrentMonth,
    currentMonthSummary,
    getAttendance,
    toggleLunch,
    toggleDinner,
    updateMonthlyAdvance,
    updateMealCosts,
    calculateMonthSummary,
    resetData,
    isLoading,
  };
};
