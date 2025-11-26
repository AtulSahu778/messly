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
  totalMeals: number; // totalLunches + totalDinners
  lunchCost: number;
  dinnerCost: number;
  totalSpent: number; // totalMeals * 50 (or average of lunch/dinner cost)
  remaining: number; // effectiveAdvance - totalSpent
  totalDaysInMonth: number;
  fullPresentDays: number; // Both meals present
  halfDays: number; // Exactly one meal present
  fullAbsentDays: number; // Both meals absent
  daysWithBothMeals: number; // Same as fullPresentDays (kept for compatibility)
  daysWithOnlyLunch: number;
  daysWithOnlyDinner: number;
  daysAbsent: number; // Same as fullAbsentDays (kept for compatibility)
}
