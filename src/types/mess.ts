// Core types for the mess management system

export interface DayAttendance {
  date: string; // ISO date string (YYYY-MM-DD)
  isLunchPresent: boolean;
  isDinnerPresent: boolean;
}

export interface MonthlyRecord {
  month: number; // 1-12
  year: number;
  advanceGiven: number; // Advance given at the start of this month
  carriedFromPrevious: number; // Leftover from last month
  lunchCost: number; // Cost per lunch
  dinnerCost: number; // Cost per dinner
}

export interface MessData {
  attendance: DayAttendance[]; // All attendance records
  monthlyRecords: MonthlyRecord[]; // Monthly advance records
  currentMonth: Date;
}

// Computed values for a month
export interface MonthSummary {
  month: number;
  year: number;
  advanceGiven: number;
  carriedFromPrevious: number;
  effectiveAdvance: number; // advanceGiven + carriedFromPrevious
  totalLunches: number;
  totalDinners: number;
  lunchCost: number;
  dinnerCost: number;
  totalSpent: number; // (totalLunches * lunchCost) + (totalDinners * dinnerCost)
  remaining: number; // effectiveAdvance - totalSpent
  totalDaysInMonth: number;
  daysWithBothMeals: number;
  daysWithOnlyLunch: number;
  daysWithOnlyDinner: number;
  daysAbsent: number;
}
