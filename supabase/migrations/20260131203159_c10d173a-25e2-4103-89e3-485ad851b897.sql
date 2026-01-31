-- Fix function search path for calculate_level
CREATE OR REPLACE FUNCTION public.calculate_level(xp_amount INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
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

-- Fix function search path for get_cashback_percentage
CREATE OR REPLACE FUNCTION public.get_cashback_percentage(user_level INTEGER)
RETURNS DECIMAL
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
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