
import { useSettingsContext } from "@/contexts/SettingsContext";

/**
 * useSettings フック（Context使用版）
 */
export const useSettings = () => {
  return useSettingsContext();
};
