
import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [dailyTarget, setDailyTarget] = useState(8);

  useEffect(() => {
    const savedTarget = localStorage.getItem('pomodoro-daily-target');
    if (savedTarget) {
      setDailyTarget(parseInt(savedTarget, 10));
    }
  }, []);

  const updateDailyTarget = (target: number) => {
    setDailyTarget(target);
    localStorage.setItem('pomodoro-daily-target', target.toString());
  };

  return {
    dailyTarget,
    updateDailyTarget,
  };
};
