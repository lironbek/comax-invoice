-- Companies table (top level of hierarchy)
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Branches table (belongs to company)
CREATE TABLE IF NOT EXISTS branches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warehouses table (belongs to branch)
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for hierarchy tables
CREATE INDEX IF NOT EXISTS idx_branches_company_id ON branches(company_id);
CREATE INDEX IF NOT EXISTS idx_warehouses_branch_id ON warehouses(branch_id);

-- Organizations table (for backwards compatibility)
CREATE TABLE IF NOT EXISTS organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with hierarchy support
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  email VARCHAR(255),
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table for storing invoice templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  warehouse_id UUID REFERENCES warehouses(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_templates_organization_id ON templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_templates_company_id ON templates(company_id);
CREATE INDEX IF NOT EXISTS idx_templates_branch_id ON templates(branch_id);
CREATE INDEX IF NOT EXISTS idx_templates_warehouse_id ON templates(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON templates
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- For public access (if needed for anonymous users)
CREATE POLICY "Allow public read access" ON templates
  FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert" ON templates
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update" ON templates
  FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete" ON templates
  FOR DELETE
  USING (true);
