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
              
              // Filter daily meals for current month only
              const allMeals = data.dailyMeals || [];
              const currentMonthMeals = allMeals.filter((meal: any) => {
                const mealDate = new Date(meal.date);
                return mealDate.getMonth() + 1 === currentMonthNum && mealDate.getFullYear() === currentYear;
              });
              setDailyMeals(currentMonthMeals);
              
              // Load monthly data for current month
              const monthKey = `${currentYear}-${currentMonthNum}`;
              const monthlyDataMap = data.monthlyDataMap || {};
              setMonthlyData(monthlyDataMap[monthKey] || null);
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
            
            const allMeals = data.dailyMeals || [];
            const currentMonthMeals = allMeals.filter((meal: any) => {
              const mealDate = new Date(meal.date);
              return mealDate.getMonth() + 1 === currentMonthNum && mealDate.getFullYear() === currentYear;
            });
            setDailyMeals(currentMonthMeals);
            
            const monthKey = `${currentYear}-${currentMonthNum}`;
            const monthlyDataMap = data.monthlyDataMap || {};
            setMonthlyData(monthlyDataMap[monthKey] || null);
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
      // Load existing data
      const stored = localStorage.getItem(STORAGE_KEY);
      let existingData: any = { dailyMeals: [], monthlyDataMap: {} };
      
      if (stored) {
        try {
          existingData = JSON.parse(stored);
          if (!existingData.monthlyDataMap) existingData.monthlyDataMap = {};
        } catch (e) {
          console.error('Error parsing stored data:', e);
        }
      }
      
      // Merge current month's meals with existing meals from other months
      const otherMonthsMeals = (existingData.dailyMeals || []).filter((meal: any) => {
        const mealDate = new Date(meal.date);
        return !(mealDate.getMonth() + 1 === currentMonthNum && mealDate.getFullYear() === currentYear);
      });
      
      const allMeals = [...otherMonthsMeals, ...dailyMeals];
      
      // Update monthly data map
      const monthKey = `${currentYear}-${currentMonthNum}`;
      const monthlyDataMap = { ...existingData.monthlyDataMap };
      if (monthlyData) {
        monthlyDataMap[monthKey] = monthlyData;
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        mealPrice,
        dailyMeals: allMeals,
        monthlyDataMap,
      }));
    }
  }, [mealPrice, dailyMeals, monthlyData, isLoading, currentYear, currentMonthNum]);

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
        // Update locally - if both meals are present after toggle, remove the entry (default state)
        const updated = dailyMeals.filter(m => m.date !== dateString);
        if (!newValue || !current.isDinnerPresent) {
          // Only store if at least one meal is absent
          updated.push({
            date: dateString,
            is_lunch_present: newValue,
            is_dinner_present: current.isDinnerPresent,
          });
        }
        setDailyMeals(updated);
      }
    } catch (error) {
      console.error('Error toggling lunch:', error);
      // Update locally on error
      const updated = dailyMeals.filter(m => m.date !== dateString);
      if (!newValue || !current.isDinnerPresent) {
        updated.push({
          date: dateString,
          is_lunch_present: newValue,
          is_dinner_present: current.isDinnerPresent,
        });
      }
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
        // Update locally - if both meals are present after toggle, remove the entry (default state)
        const updated = dailyMeals.filter(m => m.date !== dateString);
        if (!current.isLunchPresent || !newValue) {
          // Only store if at least one meal is absent
          updated.push({
            date: dateString,
            is_lunch_present: current.isLunchPresent,
            is_dinner_present: newValue,
          });
        }
        setDailyMeals(updated);
      }
    } catch (error) {
      console.error('Error toggling dinner:', error);
      const updated = dailyMeals.filter(m => m.date !== dateString);
      if (!current.isLunchPresent || !newValue) {
        updated.push({
          date: dateString,
          is_lunch_present: current.isLunchPresent,
          is_dinner_present: newValue,
        });
      }
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
        // Just update state - the effect will handle localStorage save
        setMonthlyData((prev: any) => ({
          ...prev,
          advance_given: amount,
          carried_from_previous: prev?.carried_from_previous || 0,
          effective_advance: amount + (prev?.carried_from_previous || 0),
          total_spent: prev?.total_spent || 0,
          remaining_balance: amount + (prev?.carried_from_previous || 0) - (prev?.total_spent || 0),
        }));
      }
    } catch (error) {
      console.error('Error updating advance:', error);
      setMonthlyData((prev: any) => ({
        ...prev,
        advance_given: amount,
        carried_from_previous: prev?.carried_from_previous || 0,
        effective_advance: amount + (prev?.carried_from_previous || 0),
        total_spent: prev?.total_spent || 0,
        remaining_balance: amount + (prev?.carried_from_previous || 0) - (prev?.total_spent || 0),
      }));
    }
  }, [supabase]);

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
  const totalDaysInMonth = new Date(currentYear, currentMonthNum, 0).getDate();
  
  // Count absences (only stored entries have absences, all others are present by default)
  const lunchAbsences = dailyMeals.filter(m => !m.is_lunch_present).length;
  const dinnerAbsences = dailyMeals.filter(m => !m.is_dinner_present).length;
  
  const totalLunches = totalDaysInMonth - lunchAbsences;
  const totalDinners = totalDaysInMonth - dinnerAbsences;
  
  // Calculate days with specific meal patterns
  const daysWithBothAbsent = dailyMeals.filter(m => !m.is_lunch_present && !m.is_dinner_present).length;
  const daysWithOnlyLunchAbsent = dailyMeals.filter(m => !m.is_lunch_present && m.is_dinner_present).length;
  const daysWithOnlyDinnerAbsent = dailyMeals.filter(m => m.is_lunch_present && !m.is_dinner_present).length;
  
  const daysWithBothMeals = totalDaysInMonth - daysWithBothAbsent - daysWithOnlyLunchAbsent - daysWithOnlyDinnerAbsent;
  const daysWithOnlyLunch = daysWithOnlyDinnerAbsent;
  const daysWithOnlyDinner = daysWithOnlyLunchAbsent;
  
  const totalSpentCalculated = (totalLunches * mealPrice) + (totalDinners * mealPrice);
  
  const currentMonthSummary: MonthSummary = {
    month: currentMonthNum,
    year: currentYear,
    advanceGiven: monthlyData?.advance_given || 0,
    carriedFromPrevious: monthlyData?.carried_from_previous || 0,
    effectiveAdvance: (monthlyData?.advance_given || 0) + (monthlyData?.carried_from_previous || 0),
    totalSpent: totalSpentCalculated,
    remaining: (monthlyData?.advance_given || 0) + (monthlyData?.carried_from_previous || 0) - totalSpentCalculated,
    lunchCost: mealPrice,
    dinnerCost: mealPrice,
    totalLunches,
    totalDinners,
    daysWithBothMeals,
    daysWithOnlyLunch,
    daysWithOnlyDinner,
    totalDaysInMonth,
    daysAbsent: daysWithBothAbsent,
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
