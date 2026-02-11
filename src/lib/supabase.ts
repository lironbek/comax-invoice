import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Company type (top level of hierarchy)
export interface Company {
  id?: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Branch type (belongs to company)
export interface Branch {
  id?: string;
  company_id: string;
  company?: Company;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Warehouse type (belongs to branch)
export interface Warehouse {
  id?: string;
  branch_id: string;
  branch?: Branch;
  name: string;
  code?: string;
  address?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Organization type (for backwards compatibility)
export interface Organization {
  id?: string;
  name: string;
  code?: string;
  address?: string;
  phone?: string;
  email?: string;
  company_id?: string;
  company?: Company;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// User type
export interface User {
  id?: string;
  username: string;
  password_hash?: string;
  full_name?: string;
  email?: string;
  organization_id?: string;
  organization?: Organization;
  company_id?: string;
  company?: Company;
  branch_id?: string;
  branch?: Branch;
  warehouse_id?: string;
  warehouse?: Warehouse;
  role?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Company service
export const companyService = {
  async getAll(): Promise<Company[]> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Company>): Promise<Company> {
    const { data, error } = await supabase
      .from('companies')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Branch service
export const branchService = {
  async getAll(companyId?: string): Promise<Branch[]> {
    let query = supabase
      .from('branches')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Branch | null> {
    const { data, error } = await supabase
      .from('branches')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(branch: Omit<Branch, 'id' | 'created_at' | 'updated_at' | 'company'>): Promise<Branch> {
    const { data, error } = await supabase
      .from('branches')
      .insert([branch])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Branch>): Promise<Branch> {
    const { company, ...updateData } = updates;
    const { data, error } = await supabase
      .from('branches')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('branches')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Warehouse service
export const warehouseService = {
  async getAll(branchId?: string): Promise<Warehouse[]> {
    let query = supabase
      .from('warehouses')
      .select(`
        *,
        branch:branches(
          *,
          company:companies(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (branchId) {
      query = query.eq('branch_id', branchId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Warehouse | null> {
    const { data, error } = await supabase
      .from('warehouses')
      .select(`
        *,
        branch:branches(
          *,
          company:companies(*)
        )
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(warehouse: Omit<Warehouse, 'id' | 'created_at' | 'updated_at' | 'branch'>): Promise<Warehouse> {
    const { data, error } = await supabase
      .from('warehouses')
      .insert([warehouse])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Warehouse>): Promise<Warehouse> {
    const { branch, ...updateData } = updates;
    const { data, error } = await supabase
      .from('warehouses')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('warehouses')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Organization service
export const organizationService = {
  async getAll(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        company:companies(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Organization | null> {
    const { data, error } = await supabase
      .from('organizations')
      .select(`
        *,
        company:companies(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(org: Omit<Organization, 'id' | 'created_at' | 'updated_at' | 'company'>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert([org])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { company, ...updateData } = updates;
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// User service
export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*),
        company:companies(*),
        branch:branches(*),
        warehouse:warehouses(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*),
        company:companies(*),
        branch:branches(*),
        warehouse:warehouses(*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        organization:organizations(*),
        company:companies(*),
        branch:branches(*),
        warehouse:warehouses(*)
      `)
      .eq('username', username)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'organization' | 'company' | 'branch' | 'warehouse'>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<User>): Promise<User> {
    const { organization, company, branch, warehouse, ...updateData } = updates;
    const { data, error } = await supabase
      .from('users')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

// Template type for database
export interface TemplateRecord {
  id?: string;
  name: string;
  organization_id?: string;
  organization?: Organization;
  company_id?: string;
  company?: Company;
  branch_id?: string;
  branch?: Branch;
  warehouse_id?: string;
  warehouse?: Warehouse;
  user_id?: string;
  user?: User;
  settings: {
    template: string;
    topBanner: string | null;
    logo: string | null;
    bottomBanner: string | null;
    font: string;
    backgroundColor: string;
    textColor: string;
    promotionTextColor: string;
    topBannerIsPromotional: boolean;
    logoIsPromotional: boolean;
    bottomBannerIsPromotional: boolean;
    socialMedia: {
      facebook: string;
      instagram: string;
      other: string;
    };
  };
  created_at?: string;
  updated_at?: string;
}

// Template filter options
export interface TemplateFilterOptions {
  organizationId?: string;
  companyId?: string;
  branchId?: string;
  warehouseId?: string;
  userId?: string;
}

// Template service functions
export const templateService = {
  // Get all templates with optional filtering by hierarchy
  async getTemplates(filters?: TemplateFilterOptions): Promise<TemplateRecord[]> {
    let query = supabase
      .from('templates')
      .select(`
        *,
        organization:organizations(*),
        company:companies(*),
        branch:branches(*),
        warehouse:warehouses(*),
        user:users(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.organizationId) {
      query = query.eq('organization_id', filters.organizationId);
    }
    if (filters?.companyId) {
      query = query.eq('company_id', filters.companyId);
    }
    if (filters?.branchId) {
      query = query.eq('branch_id', filters.branchId);
    }
    if (filters?.warehouseId) {
      query = query.eq('warehouse_id', filters.warehouseId);
    }
    if (filters?.userId) {
      query = query.eq('user_id', filters.userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }

    return data || [];
  },

  // Get single template by ID
  async getTemplate(id: string): Promise<TemplateRecord | null> {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        organization:organizations(*),
        company:companies(*),
        branch:branches(*),
        warehouse:warehouses(*),
        user:users(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching template:', error);
      throw error;
    }

    return data;
  },

  // Create new template
  async createTemplate(template: Omit<TemplateRecord, 'id' | 'created_at' | 'updated_at' | 'organization' | 'company' | 'branch' | 'warehouse' | 'user'>): Promise<TemplateRecord> {
    const { data, error } = await supabase
      .from('templates')
      .insert([template])
      .select()
      .single();

    if (error) {
      console.error('Error creating template:', error);
      throw error;
    }

    return data;
  },

  // Update existing template
  async updateTemplate(id: string, updates: Partial<TemplateRecord>): Promise<TemplateRecord> {
    const { organization, company, branch, warehouse, user, ...updateData } = updates;
    const { data, error } = await supabase
      .from('templates')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating template:', error);
      throw error;
    }

    return data;
  },

  // Delete template
  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  }
};
