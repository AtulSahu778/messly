-- 1. MEAL SETTINGS TABLE
CREATE TABLE meal_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  meal_price DECIMAL(10,2) DEFAULT 50,
  currency TEXT DEFAULT 'INR',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meal_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings" ON meal_settings
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. DAILY MEALS TABLE
CREATE TABLE daily_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_lunch_present BOOLEAN DEFAULT true,
  is_dinner_present BOOLEAN DEFAULT true,
  total_cost_for_day DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_meals_user_date ON daily_meals(user_id, date);

ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own meals" ON daily_meals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. MONTHLY LEDGER TABLE
CREATE TABLE monthly_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  advance_given DECIMAL(10,2) DEFAULT 0,
  carried_from_previous DECIMAL(10,2) DEFAULT 0,
  effective_advance DECIMAL(10,2) DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  remaining_balance DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, year, month)
);

CREATE INDEX idx_monthly_ledger_user_year_month ON monthly_ledger(user_id, year, month);

ALTER TABLE monthly_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own ledger" ON monthly_ledger
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. FUNCTION: Calculate daily cost
CREATE OR REPLACE FUNCTION calculate_daily_cost()
RETURNS TRIGGER AS $$
DECLARE
  meal_price DECIMAL(10,2);
BEGIN
  SELECT ms.meal_price INTO meal_price
  FROM meal_settings ms
  WHERE ms.user_id = NEW.user_id;
  
  IF meal_price IS NULL THEN
    meal_price := 50;
  END IF;
  
  NEW.total_cost_for_day := 
    (CASE WHEN NEW.is_lunch_present THEN meal_price ELSE 0 END) +
    (CASE WHEN NEW.is_dinner_present THEN meal_price ELSE 0 END);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_daily_cost
  BEFORE INSERT OR UPDATE ON daily_meals
  FOR EACH ROW
  EXECUTE FUNCTION calculate_daily_cost();

-- 5. FUNCTION: Update monthly ledger
CREATE OR REPLACE FUNCTION update_monthly_ledger(
  p_user_id UUID,
  p_year INTEGER,
  p_month INTEGER
) RETURNS void AS $$
DECLARE
  v_total_spent DECIMAL(10,2);
  v_advance_given DECIMAL(10,2);
  v_carried DECIMAL(10,2);
  v_effective DECIMAL(10,2);
  v_remaining DECIMAL(10,2);
  v_prev_remaining DECIMAL(10,2);
  v_prev_year INTEGER;
  v_prev_month INTEGER;
BEGIN
  -- Calculate previous month
  IF p_month = 1 THEN
    v_prev_year := p_year - 1;
    v_prev_month := 12;
  ELSE
    v_prev_year := p_year;
    v_prev_month := p_month - 1;
  END IF;
  
  -- Get previous month's remaining
  SELECT remaining_balance INTO v_prev_remaining
  FROM monthly_ledger
  WHERE user_id = p_user_id AND year = v_prev_year AND month = v_prev_month;
  
  v_carried := COALESCE(GREATEST(v_prev_remaining, 0), 0);
  
  -- Get current advance
  SELECT advance_given INTO v_advance_given
  FROM monthly_ledger
  WHERE user_id = p_user_id AND year = p_year AND month = p_month;
  
  v_advance_given := COALESCE(v_advance_given, 0);
  
  -- Calculate total spent
  SELECT COALESCE(SUM(total_cost_for_day), 0) INTO v_total_spent
  FROM daily_meals
  WHERE user_id = p_user_id
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
  
  v_effective := v_advance_given + v_carried;
  v_remaining := v_effective - v_total_spent;
  
  -- Upsert ledger
  INSERT INTO monthly_ledger (
    user_id, year, month, advance_given, carried_from_previous,
    effective_advance, total_spent, remaining_balance
  ) VALUES (
    p_user_id, p_year, p_month, v_advance_given, v_carried,
    v_effective, v_total_spent, v_remaining
  )
  ON CONFLICT (user_id, year, month) DO UPDATE SET
    carried_from_previous = v_carried,
    effective_advance = v_effective,
    total_spent = v_total_spent,
    remaining_balance = v_remaining,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER: Auto-update ledger on meal change
CREATE OR REPLACE FUNCTION trigger_update_ledger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_monthly_ledger(
    NEW.user_id,
    EXTRACT(YEAR FROM NEW.date)::INTEGER,
    EXTRACT(MONTH FROM NEW.date)::INTEGER
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_daily_meals_update_ledger
  AFTER INSERT OR UPDATE OR DELETE ON daily_meals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_ledger();
