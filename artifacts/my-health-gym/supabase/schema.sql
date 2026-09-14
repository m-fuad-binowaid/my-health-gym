-- ============================================================================
-- My Health Gym - Supabase Database Schema
-- Table: items
-- Run this script in the Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Create table `items`
CREATE TABLE IF NOT EXISTS public.items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  image TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'shifa',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow Public Read for Active Items
DROP POLICY IF EXISTS "Allow public read active items" ON public.items;
CREATE POLICY "Allow public read active items"
  ON public.items
  FOR SELECT
  TO public
  USING (active = true);

-- 4. Policy: Allow Authenticated Users Full CRUD Access (Admin)
DROP POLICY IF EXISTS "Allow authenticated full access" ON public.items;
CREATE POLICY "Allow authenticated full access"
  ON public.items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_active ON public.items(active);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON public.items(created_at DESC);

-- 6. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_items_updated ON public.items;
CREATE TRIGGER on_items_updated
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Seed Initial Data (Matching My Health Gym campaigns)
INSERT INTO public.items (title, price, image, category, active)
SELECT * FROM (VALUES
  ('96 يوم - انطلاقة وطنية', 596.00, '', 'shifa', true),
  ('3 شهور + 96 يوم مجاناً (الأكثر طلباً)', 796.00, '', 'shifa', true),
  ('6 شهور + 96 يوم مجاناً', 996.00, '', 'shifa', true),
  ('9 شهور + 96 يوم مجاناً', 1096.00, '', 'shifa', true),
  ('ثلاثة شهور - بداية قوية', 596.00, '', 'mansouraSaadah', true),
  ('سته شهور - التزام يصنع الفرق', 696.00, '', 'mansouraSaadah', true),
  ('سنة + شهر - القيمة الأفضل', 996.00, '', 'mansouraSaadah', true)
) AS v(title, price, image, category, active)
WHERE NOT EXISTS (SELECT 1 FROM public.items LIMIT 1);
