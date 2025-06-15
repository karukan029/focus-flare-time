import { useReducer, useCallback } from 'react';
import { useSettings } from './useSettings';
import { useToast } from './use-toast';

type SettingsState = {
  tempTarget: string;
  open: boolean;
  isValid: boolean;
  error: string | null;
};

type SettingsAction =
  | { type: 'SET_TEMP_TARGET'; payload: string }
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'RESET_FORM'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'VALIDATE' };

const settingsReducer = (state: SettingsState, action: SettingsAction): SettingsState => {
  switch (action.type) {
    case 'SET_TEMP_TARGET': {
      const target = parseInt(action.payload, 10);
      const isValid = !isNaN(target) && target >= 1 && target <= 20;
      return {
        ...state,
        tempTarget: action.payload,
        isValid,
        error: isValid ? null : '目標は1〜20の範囲で設定してください',
      };
    }
    case 'SET_OPEN':
      return { ...state, open: action.payload };
    case 'RESET_FORM':
      return {
        ...state,
        tempTarget: action.payload.toString(),
        isValid: true,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isValid: action.payload === null };
    case 'VALIDATE': {
      const target = parseInt(state.tempTarget, 10);
      const isValid = !isNaN(target) && target >= 1 && target <= 20;
      return {
        ...state,
        isValid,
        error: isValid ? null : '目標は1〜20の範囲で設定してください',
      };
    }
    default:
      return state;
  }
};

export const useSettingsDialog = () => {
  const { dailyTarget, updateDailyTarget } = useSettings();
  const { toast } = useToast();
  
  const [state, dispatch] = useReducer(settingsReducer, {
    tempTarget: dailyTarget.toString(),
    open: false,
    isValid: true,
    error: null,
  });

  const handleSave = useCallback(() => {
    if (!state.isValid) {
      toast({
        title: "エラー",
        description: state.error || "入力値が無効です",
        variant: "destructive",
      });
      return;
    }

    const target = parseInt(state.tempTarget, 10);
    try {
      updateDailyTarget(target);
      dispatch({ type: 'SET_OPEN', payload: false });
      toast({
        title: "設定を保存しました",
        description: `1日の目標を${target}ポモドーロに設定しました`,
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "設定の保存に失敗しました",
        variant: "destructive",
      });
    }
  }, [state.isValid, state.tempTarget, state.error, updateDailyTarget, toast]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (newOpen) {
      dispatch({ type: 'RESET_FORM', payload: dailyTarget });
    }
    dispatch({ type: 'SET_OPEN', payload: newOpen });
  }, [dailyTarget]);

  const handleTargetChange = useCallback((value: string) => {
    dispatch({ type: 'SET_TEMP_TARGET', payload: value });
  }, []);

  const handleClose = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: false });
  }, []);

  return {
    state,
    handlers: {
      handleSave,
      handleOpenChange,
      handleTargetChange,
      handleClose,
    },
  };
};