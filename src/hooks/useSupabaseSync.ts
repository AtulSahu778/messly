import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

/**
 * Supabase Sync Hook
 * 
 * UI Integration Notes:
 * - Loading states should use dark overlay: bg-[#070A09]/80 with backdrop-blur
 * - Error messages should use: text-[#FF453A] (Expense Red)
 * - Success messages should use: text-[#30D158] (Money Green)
 * - All UI components should match Finance-Optimized iOS Dark Palette
 * 
 * Error Handling:
 * - Network errors → Show toast with bg-[#111513] and text-[#FF453A]
 * - Auth errors → Display inline with border-[#FF453A]
 * - Success states → Use bg-[#30D158]/10 with text-[#30D158]
 */
export const useSupabaseData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no Supabase client, just set loading to false
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auth
  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { 
        error: { 
          message: 'Supabase is not configured. Please restart the dev server after adding credentials to .env file.' 
        } 
      };
    }
    return await supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { 
        error: { 
          message: 'Supabase is not configured. Please restart the dev server after adding credentials to .env file.' 
        } 
      };
    }
    return await supabase.auth.signUp({ email, password });
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return { 
        error: { 
          message: 'Supabase is not configured.' 
        } 
      };
    }
    return await supabase.auth.signOut();
  }, []);

  // Meal Settings
  const getMealSettings = useCallback(async () => {
    if (!user || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('meal_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting meal settings:', error);
      return null;
    }
  }, [user]);

  const upsertMealSettings = useCallback(async (mealPrice: number) => {
    if (!user || !supabase) return;
    try {
      const { error } = await supabase
        .from('meal_settings')
        .upsert({ user_id: user.id, meal_price: mealPrice }, { onConflict: 'user_id' });
      if (error) throw error;
    } catch (error) {
      console.error('Error upserting meal settings:', error);
    }
  }, [user]);

  // Daily Meals
  const getDailyMeals = useCallback(async (year: number, month: number) => {
    if (!user || !supabase) return [];
    try {
      const { data, error } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', `${year}-${String(month).padStart(2, '0')}-01`)
        .lt('date', `${month === 12 ? year + 1 : year}-${String(month === 12 ? 1 : month + 1).padStart(2, '0')}-01`);
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting daily meals:', error);
      return [];
    }
  }, [user]);

  const upsertDailyMeal = useCallback(async (date: string, isLunchPresent: boolean, isDinnerPresent: boolean) => {
    if (!user || !supabase) return;
    try {
      const { error } = await supabase
        .from('daily_meals')
        .upsert({
          user_id: user.id,
          date,
          is_lunch_present: isLunchPresent,
          is_dinner_present: isDinnerPresent
        }, { onConflict: 'user_id,date' });
      if (error) throw error;
    } catch (error) {
      console.error('Error upserting daily meal:', error);
      throw error;
    }
  }, [user]);

  // Monthly Ledger
  const getMonthlyLedger = useCallback(async (year: number, month: number) => {
    if (!user || !supabase) return null;
    try {
      const { data, error } = await supabase
        .from('monthly_ledger')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', year)
        .eq('month', month)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting monthly ledger:', error);
      return null;
    }
  }, [user]);

  const setMonthlyAdvance = useCallback(async (year: number, month: number, advanceGiven: number) => {
    if (!user || !supabase) return;
    try {
      const { error: upsertError } = await supabase
        .from('monthly_ledger')
        .upsert({
          user_id: user.id,
          year,
          month,
          advance_given: advanceGiven
        }, { onConflict: 'user_id,year,month' });
      if (upsertError) throw upsertError;
      
      const { error: rpcError } = await supabase.rpc('update_monthly_ledger', {
        p_user_id: user.id,
        p_year: year,
        p_month: month
      });
      if (rpcError) throw rpcError;
    } catch (error) {
      console.error('Error setting monthly advance:', error);
      throw error;
    }
  }, [user]);

  const refreshMonthlyLedger = useCallback(async (year: number, month: number) => {
    if (!user || !supabase) return;
    try {
      const { error } = await supabase.rpc('update_monthly_ledger', {
        p_user_id: user.id,
        p_year: year,
        p_month: month
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error refreshing monthly ledger:', error);
    }
  }, [user]);

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    getMealSettings,
    upsertMealSettings,
    getDailyMeals,
    upsertDailyMeal,
    getMonthlyLedger,
    setMonthlyAdvance,
    refreshMonthlyLedger,
  };
};
