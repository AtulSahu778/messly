import { useState, useEffect } from 'react';

interface MessData {
  dailyCost: number;
  absentDates: string[];
  currentMonth: Date;
}

const STORAGE_KEY = 'mess-manager-data';

export const useMessData = () => {
  const [dailyCost, setDailyCost] = useState<number>(100);
  const [absentDates, setAbsentDates] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: MessData = JSON.parse(stored);
        setDailyCost(data.dailyCost || 100);
        setAbsentDates(data.absentDates || []);
        setCurrentMonth(new Date(data.currentMonth) || new Date());
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data: MessData = {
      dailyCost,
      absentDates,
      currentMonth,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [dailyCost, absentDates, currentMonth]);

  const toggleAbsentDate = (dateString: string) => {
    setAbsentDates(prev => {
      if (prev.includes(dateString)) {
        return prev.filter(d => d !== dateString);
      }
      return [...prev, dateString];
    });
  };

  const isDateAbsent = (dateString: string) => {
    return absentDates.includes(dateString);
  };

  const resetData = () => {
    setDailyCost(100);
    setAbsentDates([]);
    setCurrentMonth(new Date());
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    dailyCost,
    setDailyCost,
    absentDates,
    toggleAbsentDate,
    isDateAbsent,
    currentMonth,
    setCurrentMonth,
    resetData,
  };
};
