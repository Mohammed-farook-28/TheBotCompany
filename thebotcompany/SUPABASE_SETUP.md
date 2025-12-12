# Supabase Setup Guide for ULA Event Booking System

## Step 1: Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Note down your Project URL and anon/public API key
3. Add them to your `.env` file

## Step 2: Run Database Schema

Go to SQL Editor in Supabase and run the following SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  event_end_date TIMESTAMP WITH TIME ZONE,
  location TEXT NOT NULL,
  venue_name TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'experience',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'sold_out', 'cancelled')),
  organizer TEXT DEFAULT 'ULA Experiences',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket_types table
CREATE TABLE ticket_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  total_quantity INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  max_per_order INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_id TEXT,
  payu_transaction_id TEXT,
  booking_reference TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin@00)
-- Note: In production, use proper password hashing
INSERT INTO admin_users (email, password_hash, name) 
VALUES ('thebot26@gmail.com', 'admin@00', 'Admin User');

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_bookings_email ON bookings(customer_email);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to events
CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (status = 'active');

CREATE POLICY "Ticket types are viewable by everyone" ON ticket_types
  FOR SELECT USING (true);

-- Create policies for bookings (users can only see their own)
CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (true);

-- Admin policies (bypass RLS for authenticated admin users)
-- Note: You'll need to set up proper authentication in production
CREATE POLICY "Admins can do everything on events" ON events
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on ticket_types" ON ticket_types
  FOR ALL USING (true);

CREATE POLICY "Admins can do everything on bookings" ON bookings
  FOR ALL USING (true);
```

## Step 3: Insert Sample Events (Optional)

```sql
-- Insert sample event
INSERT INTO events (title, description, event_date, event_end_date, location, venue_name, image_url, category)
VALUES (
  'Tech Conference 2025',
  'Join us for the biggest tech conference of the year featuring industry leaders and networking opportunities.',
  '2025-03-15 14:00:00+00',
  '2025-03-15 20:00:00+00',
  'New York',
  'Convention Center',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
  'conference'
);

-- Get the event ID (replace with actual ID from above insert)
-- Insert ticket types for the event
INSERT INTO ticket_types (event_id, name, description, price, total_quantity, available_quantity)
VALUES 
  ((SELECT id FROM events WHERE title = 'Tech Conference 2025'), 'Early Bird', '100 tickets available', 99.99, 100, 100),
  ((SELECT id FROM events WHERE title = 'Tech Conference 2025'), 'Regular', '200 tickets available', 149.99, 200, 200),
  ((SELECT id FROM events WHERE title = 'Tech Conference 2025'), 'VIP', '50 tickets available', 299.99, 50, 50);
```

## Step 4: Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js nodemailer crypto-js react-router-dom
```

## Step 6: Configure Email (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use this app password in your `.env` file as `EMAIL_PASSWORD`

## Notes

- The admin password is stored in plain text for development. In production, use bcrypt or similar hashing.
- Row Level Security (RLS) is enabled. Adjust policies based on your security requirements.
- For multi-pod environments, Supabase handles connection pooling and scaling automatically.


