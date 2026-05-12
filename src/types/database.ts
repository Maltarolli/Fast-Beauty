// Database types for Supabase tables
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  trial_ends_at: string;
  subscription_status: 'active' | 'inactive' | 'trialing';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export interface Client {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  observations: string | null;
  last_visit: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  user_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  client_id: string | null;
  service_id: string | null;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  service_name: string;
  price: number;
  observations: string | null;
  is_paid: boolean;
  created_at: string;
}

export interface TimeBlock {
  id: string;
  user_id: string;
  block_date: string;
  is_full_day: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'entrada' | 'saida';
  title: string;
  amount: number;
  category: string;
  transaction_date: string;
  source: 'manual' | 'agenda' | 'estoque' | 'fixo';
  source_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  category: string | null;
  quantity: number;
  min_quantity: number;
  created_at: string;
}

export interface FixedRule {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  day_of_month: number;
  created_at: string;
}

export interface PurchaseItem {
  id: string;
  user_id: string;
  transaction_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  purchase_date: string;
  created_at: string;
}
