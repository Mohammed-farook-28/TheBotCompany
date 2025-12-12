import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add them to your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'ula-event-booking',
    },
  },
});

// Types for database tables
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_end_date?: string;
  location: string;
  venue_name?: string;
  image_url?: string;
  category: string;
  status: 'active' | 'inactive' | 'sold_out' | 'cancelled';
  organizer: string;
  terms_and_conditions?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  total_quantity: number;
  available_quantity: number;
  max_per_order: number;
  created_at: string;
}

export interface Booking {
  id: string;
  event_id: string;
  ticket_type_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity: number;
  total_amount: number;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_id?: string;
  payu_transaction_id?: string;
  booking_reference: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name?: string;
  created_at: string;
}

export interface TermsCondition {
  id: string;
  title: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
