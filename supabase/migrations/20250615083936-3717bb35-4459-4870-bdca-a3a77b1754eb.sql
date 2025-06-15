
-- Create a table for pomodoro sessions
CREATE TABLE public.pomodoro_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed_count INTEGER NOT NULL DEFAULT 0,
  total_work_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for pomodoro_sessions table
CREATE POLICY "Users can view their own pomodoro sessions" 
  ON public.pomodoro_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pomodoro sessions" 
  ON public.pomodoro_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pomodoro sessions" 
  ON public.pomodoro_sessions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create an index for faster queries
CREATE INDEX idx_pomodoro_sessions_user_date ON public.pomodoro_sessions(user_id, date DESC);
