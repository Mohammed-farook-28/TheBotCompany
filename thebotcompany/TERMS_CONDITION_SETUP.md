# Terms & Conditions Management Setup

## Database Schema for T&C

Run this SQL in Supabase SQL Editor to add T&C management:

```sql
-- Create terms_conditions table
CREATE TABLE terms_conditions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default T&C
INSERT INTO terms_conditions (title, content, display_order, is_active) VALUES
('Booking Confirmation', 'Your booking is confirmed only after successful payment. You will receive a confirmation email with your ticket and QR code within 15 minutes of payment.', 1, true),
('Ticket Validity', 'Each ticket is valid only for the event date, time, and ticket type specified. Entry will be granted only upon presentation of valid ticket (QR code or booking reference) and valid photo ID.', 2, true),
('Cancellation & Refunds', '• Cancellations made 7+ days before event: 80% refund
• Cancellations made 3-7 days before event: 50% refund
• Cancellations made less than 3 days before event: No refund
• Refunds will be processed within 7-10 business days', 3, true),
('Age Restrictions', 'Entry age requirements vary by event. Children under 12 must be accompanied by an adult. Age verification may be required at the venue.', 4, true),
('Event Changes', 'ULA Experiences reserves the right to change event dates, times, or venues due to unforeseen circumstances. In such cases, you will be notified via email and offered alternative dates or full refund.', 5, true),
('Code of Conduct', 'Attendees must follow venue rules and event guidelines. ULA Experiences reserves the right to refuse entry or remove attendees who violate conduct policies without refund.', 6, true),
('Photography & Videography', 'By attending the event, you consent to being photographed/recorded for promotional purposes. Professional photography equipment may be restricted.', 7, true),
('Liability', 'ULA Experiences is not responsible for personal belongings, injuries, or damages during the event. Attendees participate at their own risk.', 8, true),
('Ticket Transfer', 'Tickets are non-transferable without prior written consent from ULA Experiences. Unauthorized resale or transfer may result in ticket cancellation.', 9, true),
('Contact & Support', 'For any queries or support, contact us at:
📧 Email: thebot26@gmail.com
📞 Phone: +91 90254 39428
Response time: Within 24 hours', 10, true);

-- Create trigger for updated_at
CREATE TRIGGER update_terms_conditions_updated_at 
BEFORE UPDATE ON terms_conditions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE terms_conditions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active terms" 
ON terms_conditions FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage terms" 
ON terms_conditions FOR ALL 
USING (true);

-- Create indexes
CREATE INDEX idx_terms_order ON terms_conditions(display_order);
CREATE INDEX idx_terms_active ON terms_conditions(is_active);
```

## Features Added

1. **Admin can add/edit/delete T&C items**
2. **Order T&C by drag & drop or numbering**
3. **Enable/disable individual T&C items**
4. **Dynamic display on event pages**


