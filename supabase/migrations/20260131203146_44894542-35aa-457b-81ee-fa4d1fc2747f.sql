-- Create user progress table for leveling system
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  total_polls_answered INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Users can view their own progress
CREATE POLICY "Users can view their own progress"
ON public.user_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
ON public.user_progress
FOR UPDATE
USING (auth.uid() = user_id);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Level thresholds: 1=0, 2=100, 3=250, 4=500, 5=1000, 6=1750, 7=2750, 8=4000, 9=5500, 10=7500
  IF xp_amount >= 7500 THEN RETURN 10;
  ELSIF xp_amount >= 5500 THEN RETURN 9;
  ELSIF xp_amount >= 4000 THEN RETURN 8;
  ELSIF xp_amount >= 2750 THEN RETURN 7;
  ELSIF xp_amount >= 1750 THEN RETURN 6;
  ELSIF xp_amount >= 1000 THEN RETURN 5;
  ELSIF xp_amount >= 500 THEN RETURN 4;
  ELSIF xp_amount >= 250 THEN RETURN 3;
  ELSIF xp_amount >= 100 THEN RETURN 2;
  ELSE RETURN 1;
  END IF;
END;
$$;

-- Function to get cashback percentage by level
CREATE OR REPLACE FUNCTION public.get_cashback_percentage(user_level INTEGER)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Cashback: L1=0%, L2=2%, L3=3%, L4=5%, L5=7%, L6=10%, L7=12%, L8=15%, L9=18%, L10=20%
  CASE user_level
    WHEN 1 THEN RETURN 0;
    WHEN 2 THEN RETURN 2;
    WHEN 3 THEN RETURN 3;
    WHEN 4 THEN RETURN 5;
    WHEN 5 THEN RETURN 7;
    WHEN 6 THEN RETURN 10;
    WHEN 7 THEN RETURN 12;
    WHEN 8 THEN RETURN 15;
    WHEN 9 THEN RETURN 18;
    WHEN 10 THEN RETURN 20;
    ELSE RETURN 0;
  END CASE;
END;
$$;

-- Trigger to auto-update level when XP changes
CREATE OR REPLACE FUNCTION public.update_level_on_xp_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.level := calculate_level(NEW.xp);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_user_level
BEFORE UPDATE OF xp ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_level_on_xp_change();