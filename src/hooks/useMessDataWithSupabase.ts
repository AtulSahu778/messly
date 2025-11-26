import { useState, useEffect, useCallback } from 'react';
import { useSupabaseData } from './useSupabaseSync';
import { DayAttendance, MonthSummary } from '@/types/mess';

const STORAGE_KEY = 'messly-data-v2';

export const useMessDataWithSupabase = () => {
  const supabase = useSupabaseData();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [mealPrice, setMealPrice] = useState(50);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [dailyMeals, setDailyMeals] = useState<any[]>([]);

  const currentMonthNum = currentMonth.getMonth() + 1;
  const currentYear = currentMonth.getFullYear();

  // Load data on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        if (supabase.user) {
          // Load from Supabase
          const [settings, meals, ledger] = await Promise.all([
            supabase.getMealSettings(),
            supabase.getDailyMeals(currentYear, currentMonthNum),
            supabase.getMonthlyLedger(currentYear, currentMonthNum),
          ]);
          
          if (settings) setMealPrice(settings.meal_price);
          setDailyMeals(meals);
          setMonthlyData(ledger);
        } else {
          // Load from localStorage
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            try {
              const data = JSON.parse(stored);
              setMealPrice(data.mealPrice || 50);
              setDailyMeals(data.dailyMeals || []);
              setMonthlyData(data.monthlyData || null);
            } catch (e) {
              console.error('Error loading local data:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to localStorage on error
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const data = JSON.parse(stored);
            setMealPrice(data.mealPrice || 50);
            setDailyMeals(data.dailyMeals || []);
            setMonthlyData(data.monthlyData || null);
          } catch (e) {
            console.error('Error loading local data:', e);
          }
        }
      }
      
      setIsLoading(false);
    };

    loadData();
  }, [supabase.user, currentYear, currentMonthNum]);

  // Save to localStorage (backup)
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mealPrice,
        dailyMeals,
        monthlyData,
      }));
    }
  }, [mealPrice, dailyMeals, monthlyData, isLoading]);

  // Get attendance for a date
  const getAttendance = useCallback((dateString: string): DayAttendance => {
    const meal = dailyMeals.find(m => m.date === dateString);
    return {
      date: dateString,
      isLunchPresent: meal?.is_lunch_present ?? true,
      isDinnerPresent: meal?.is_dinner_present ?? true,
    };
  }, [dailyMeals]);

  // Toggle lunch
  const toggleLunch = useCallback(async (dateString: string) => {
    const current = getAttendance(dateString);
    const newValue = !current.isLunchPresent;
    
    try {
      if (supabase.user) {
        await supabase.upsertDailyMeal(dateString, newValue, current.isDinnerPresent);
        await supabase.refreshMonthlyLedger(currentYear, currentMonthNum);
        
        // Reload data
        const [meals, ledger] = await Promise.all([
          supabase.getDailyMeals(currentYear, currentMonthNum),
          supabase.getMonthlyLedger(currentYear, currentMonthNum),
        ]);
        setDailyMeals(meals);
        setMonthlyData(ledger);
      } else {
        // Update locally
        const updated = dailyMeals.filter(m => m.date !== dateString);
        updated.push({
          date: dateString,
          is_lunch_present: newValue,
          is_dinner_present: current.isDinnerPresent,
        });
        setDailyMeals(updated);
      }
    } catch (error) {
      console.error('Error toggling lunch:', error);
      // Update locally on error
      const updated = dailyMeals.filter(m => m.date !== dateString);
      updated.push({
        date: dateString,
        is_lunch_present: newValue,
        is_dinner_present: current.isDinnerPresent,
      });
      setDailyMeals(updated);
    }
  }, [supabase, getAttendance, dailyMeals, currentYear, currentMonthNum]);

  // Toggle dinner
  const toggleDinner = useCallback(async (dateString: string) => {
    const current = getAttendance(dateString);
    const newValue = !current.isDinnerPresent;
    
    try {
      if (supabase.user) {
        await supabase.upsertDailyMeal(dateString, current.isLunchPresent, newValue);
        await supabase.refreshMonthlyLedger(currentYear, currentMonthNum);
        
        const [meals, ledger] = await Promise.all([
          supabase.getDailyMeals(currentYear, currentMonthNum),
          supabase.getMonthlyLedger(currentYear, currentMonthNum),
        ]);
        setDailyMeals(meals);
        setMonthlyData(ledger);
      } else {
        const updated = dailyMeals.filter(m => m.date !== dateString);
        updated.push({
          date: dateString,
          is_lunch_present: current.isLunchPresent,
          is_dinner_present: newValue,
        });
        setDailyMeals(updated);
      }
    } catch (error) {
      console.error('Error toggling dinner:', error);
      const updated = dailyMeals.filter(m => m.date !== dateString);
      updated.push({
        date: dateString,
        is_lunch_present: current.isLunchPresent,
        is_dinner_present: newValue,
      });
      setDailyMeals(updated);
    }
  }, [supabase, getAttendance, dailyMeals, currentYear, currentMonthNum]);

  // Update monthly advance
  const updateMonthlyAdvance = useCallback(async (month: number, year: number, amount: number) => {
    try {
      if (supabase.user) {
        await supabase.setMonthlyAdvance(year, month, amount);
        const ledger = await supabase.getMonthlyLedger(year, month);
        setMonthlyData(ledger);
      } else {
        setMonthlyData({ ...monthlyData, advance_given: amount });
      }
    } catch (error) {
      console.error('Error updating advance:', error);
      setMonthlyData({ ...monthlyData, advance_given: amount });
    }
  }, [supabase, monthlyData]);

  // Update meal costs
  const updateMealCosts = useCallback(async (lunchCost: number, dinnerCost: number) => {
    const avgCost = (lunchCost + dinnerCost) / 2;
    setMealPrice(avgCost);
    
    try {
      if (supabase.user) {
        await supabase.upsertMealSettings(avgCost);
        await supabase.refreshMonthlyLedger(currentYear, currentMonthNum);
        const ledger = await supabase.getMonthlyLedger(currentYear, currentMonthNum);
        setMonthlyData(ledger);
      }
    } catch (error) {
      console.error('Error updating meal costs:', error);
    }
  }, [supabase, currentYear, currentMonthNum]);

  // Calculate current month summary
  const currentMonthSummary: MonthSummary = {
    month: currentMonthNum,
    year: currentYear,
    advanceGiven: monthlyData?.advance_given || 0,
    carriedFromPrevious: monthlyData?.carried_from_previous || 0,
    effectiveAdvance: monthlyData?.effective_advance || 0,
    totalSpent: monthlyData?.total_spent || 0,
    remaining: monthlyData?.remaining_balance || 0,
    lunchCost: mealPrice,
    dinnerCost: mealPrice,
    totalLunches: dailyMeals.filter(m => m.is_lunch_present).length,
    totalDinners: dailyMeals.filter(m => m.is_dinner_present).length,
    daysWithBothMeals: dailyMeals.filter(m => m.is_lunch_present && m.is_dinner_present).length,
    daysWithOnlyLunch: dailyMeals.filter(m => m.is_lunch_present && !m.is_dinner_present).length,
    daysWithOnlyDinner: dailyMeals.filter(m => !m.is_lunch_present && m.is_dinner_present).length,
    totalDaysInMonth: new Date(currentYear, currentMonthNum, 0).getDate(),
    daysAbsent: new Date(currentYear, currentMonthNum, 0).getDate() - dailyMeals.length,
  };

  const resetData = useCallback(async () => {
    setDailyMeals([]);
    setMonthlyData(null);
    setMealPrice(50);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user: supabase.user,
    isLoading: isLoading || supabase.isLoading,
    currentMonth,
    setCurrentMonth,
    currentMonthSummary,
    getAttendance,
    toggleLunch,
    toggleDinner,
    updateMonthlyAdvance,
    updateMealCosts,
    resetData,
    signIn: supabase.signIn,
    signUp: supabase.signUp,
    signOut: supabase.signOut,
  };
};
