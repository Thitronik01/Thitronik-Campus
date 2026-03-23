-- 002_products_and_dependencies.sql
-- Create the Configurator tables

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price_hint TEXT,
    image_path TEXT,
    is_base_unit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.product_dependencies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_sku TEXT NOT NULL REFERENCES public.products(sku) ON DELETE CASCADE,
    dependency_type TEXT NOT NULL, -- 'requires', 'recommends', 'incompatible', 'upgrades'
    target_sku TEXT, 
    rule TEXT, -- e.g., 'OR:100770'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.vehicle_product_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vehicle_slug TEXT NOT NULL,
    product_sku TEXT NOT NULL REFERENCES public.products(sku) ON DELETE CASCADE,
    dip_switch_setting JSONB,
    notes TEXT,
    min_serial_number TEXT,
    min_software_version TEXT,
    warnings TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indices for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);
CREATE INDEX IF NOT EXISTS idx_product_dependencies_product_sku ON public.product_dependencies(product_sku);
CREATE INDEX IF NOT EXISTS idx_vehicle_product_config_vehicle_slug ON public.vehicle_product_config(vehicle_slug);

-- Setup RLS (Row Level Security) - Read only for anonymous/public
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_product_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on product_dependencies" ON public.product_dependencies FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on vehicle_product_config" ON public.vehicle_product_config FOR SELECT USING (true);
