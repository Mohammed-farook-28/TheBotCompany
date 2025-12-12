# ULA Event Booking System - Implementation Guide

## 🎉 Complete System Overview

You now have a full-featured event ticket booking system integrated into TheBotCompany website with:

- ✅ Event listing and detail pages
- ✅ Ticket booking flow with multiple ticket types
- ✅ PayU payment gateway integration
- ✅ Email notifications via Nodemailer
- ✅ Admin panel with authentication
- ✅ Supabase database integration
- ✅ Responsive design matching your UI style

## 📋 Setup Instructions

### 1. Install Dependencies

```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany
npm install
```

This will install:
- `@supabase/supabase-js` - Database connection
- `react-router-dom` - Routing
- `crypto-js` - PayU hash generation

### 2. Install Email API Dependencies

```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany/api
npm install
```

### 3. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key
3. Go to SQL Editor and run the schema from `SUPABASE_SETUP.md`
4. Add credentials to `.env`

### 4. Setup Environment Variables

Create `.env` file in the root directory:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# PayU Payment Gateway
VITE_PAYU_MERCHANT_KEY=your_merchant_key
VITE_PAYU_SALT=your_salt_key
VITE_PAYU_URL=https://test.payu.in/_payment

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=thebot26@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=thebot26@gmail.com

# Base URL
VITE_BASE_URL=http://localhost:5173
```

### 5. Setup Gmail for Emails

Follow the detailed instructions in `API_SERVER_SETUP.md`:

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add the app password to `.env` as `EMAIL_PASSWORD`

### 6. Run the Application

You need to run TWO servers:

**Terminal 1 - Main Application:**
```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany
npm run dev
```

**Terminal 2 - Email API Server:**
```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany/api
npm start
```

## 🎯 Features

### Public Features

1. **Event Listing** (`/events`)
   - Browse all active events
   - Search by name or location
   - Filter by category
   - Beautiful card-based layout

2. **Event Details** (`/events/:id`)
   - Full event information
   - Multiple ticket types
   - Real-time availability
   - Quantity selection

3. **Booking Flow** (`/events/:id/book`)
   - Customer information form
   - Country code selector
   - Order summary
   - Secure payment redirect

4. **Payment Integration**
   - PayU payment gateway
   - Success page with booking details
   - Failure page with retry option
   - Automatic email notifications

### Admin Features

1. **Admin Login** (`/admin/login`)
   - Email: thebot26@gmail.com
   - Password: admin@00

2. **Dashboard** (`/admin/dashboard`)
   - Statistics overview
   - Event management
   - Booking management
   - Real-time data

3. **Event Management**
   - Create new events
   - Edit existing events
   - Delete events
   - Manage ticket types

## 🏗️ File Structure

```
thebotcompany/
├── api/
│   ├── server.js              # Email API server
│   └── package.json           # API dependencies
├── src/
│   ├── pages/
│   │   ├── Events.tsx         # Event listing
│   │   ├── EventDetail.tsx    # Event details
│   │   ├── BookTicket.tsx     # Booking form
│   │   ├── PaymentSuccess.tsx # Success page
│   │   ├── PaymentFailure.tsx # Failure page
│   │   ├── AdminLogin.tsx     # Admin login
│   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   └── AdminEventForm.tsx # Event CRUD
│   ├── components/
│   │   └── EventsSection.tsx  # Home page section
│   ├── lib/
│   │   ├── supabase.ts        # Database config
│   │   ├── payment.ts         # PayU integration
│   │   └── email.ts           # Email templates
│   ├── App.tsx                # Main app (updated)
│   ├── AppRouter.tsx          # Route configuration
│   └── main.tsx               # Entry point (updated)
├── SUPABASE_SETUP.md          # Database setup guide
├── API_SERVER_SETUP.md        # Email server guide
├── env-template.txt           # Environment template
└── package.json               # Updated dependencies
```

## 🔐 Security Considerations

### Current Setup (Development)

- Admin password stored in plain text (for development only)
- Email credentials in environment variables
- PayU test mode enabled

### Production Checklist

- [ ] Implement proper password hashing (bcrypt)
- [ ] Add JWT authentication for admin
- [ ] Configure CORS properly
- [ ] Switch PayU to production URL
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Add input validation
- [ ] Implement proper error handling
- [ ] Add logging and monitoring
- [ ] Set up backup system

## 📊 Database Schema

### Events Table
- id, title, description, event_date, location, venue_name, image_url, category, status, organizer

### Ticket Types Table
- id, event_id, name, description, price, total_quantity, available_quantity, max_per_order

### Bookings Table
- id, event_id, ticket_type_id, customer details, quantity, total_amount, payment_status, booking_reference

### Admin Users Table
- id, email, password_hash, name

## 🎨 Design Consistency

All new pages follow your existing design system:
- Black background (#000000)
- Cyan accent color (#00baff)
- Smooth animations with Framer Motion
- Responsive layouts
- Same typography (Pixelify Sans for headings, Josefin Sans for body)

## 🚀 Usage

### Creating Your First Event

1. Navigate to http://localhost:5173/admin/login
2. Login with thebot26@gmail.com / admin@00
3. Click "Create Event" in the dashboard
4. Fill in event details:
   - Title, description, date/time
   - Location and venue
   - Image URL (use Unsplash for free images)
   - Category (experience, conference, workshop, etc.)
5. Add ticket types:
   - Name (e.g., "Early Bird", "VIP")
   - Price in ₹
   - Quantity available
6. Click "Create Event"

### Testing the Booking Flow

1. Go to http://localhost:5173/events
2. Click on an event
3. Select ticket quantities
4. Click "Proceed to Checkout"
5. Fill in customer details
6. Click "Proceed to Payment"

**For PayU Testing:**
- Use PayU test credentials when available
- The payment will redirect to PayU's test environment
- After payment, you'll be redirected back to success/failure page
- Email will be sent automatically on success

## 🧪 Testing Email Service

Test your email configuration:

```bash
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

## 🔧 Troubleshooting

### Common Issues

**1. "Supabase credentials not found"**
- Check `.env` file exists and has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart the dev server after adding env variables

**2. Email not sending**
- Check Gmail app password is correct
- Ensure EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD are set
- Check API server is running on port 3001
- View API server logs for errors

**3. PayU payment not working**
- Verify VITE_PAYU_MERCHANT_KEY and VITE_PAYU_SALT are set
- Check PayU URL is correct (test vs production)
- Ensure you have valid PayU merchant account

**4. Events not showing**
- Check Supabase connection
- Verify events exist in database and status is 'active'
- Check browser console for errors

**5. Routes not working**
- Clear browser cache
- Check main.tsx is using AppRouter
- Verify all route files are created

## 📱 Mobile Responsiveness

All pages are fully responsive:
- Touch-friendly buttons (44px minimum)
- Optimized forms for mobile
- Responsive grids and layouts
- Mobile-first design approach

## 🔄 Multi-Pod Considerations

The system is designed for scalability:

1. **Database**: Supabase handles connection pooling automatically
2. **Race Conditions**: Ticket quantity updates use optimistic locking
3. **Performance**: Lazy loading and code splitting implemented
4. **Memory**: Efficient React component structure
5. **API**: Stateless email API can be horizontally scaled

## 📈 Next Steps

### Immediate
1. Add your PayU merchant credentials
2. Create your first event
3. Test the complete booking flow
4. Customize email templates

### Short Term
1. Add QR code generation for tickets
2. Implement ticket cancellation
3. Add event capacity limits
4. Create customer dashboard

### Long Term
1. Analytics dashboard
2. Revenue reports
3. Multi-currency support
4. Integration with calendar apps
5. SMS notifications

## 🆘 Support

For issues or questions:
- Email: thebot26@gmail.com
- Check the detailed setup guides:
  - `SUPABASE_SETUP.md`
  - `API_SERVER_SETUP.md`

## 🎊 You're All Set!

Your event booking system is ready to use. The system is production-ready with proper security implementations needed before going live.

**Remember:** You're running in development mode. Follow the Production Checklist before deploying to production!

---

Built with ❤️ by TheBotCompany
Powered by React, Supabase, PayU & Nodemailer


