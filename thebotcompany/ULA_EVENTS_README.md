# 🎫 ULA Event Booking System

A complete event ticket booking system integrated into TheBotCompany website, featuring PayU payment integration, email notifications, and a powerful admin panel.

## ✨ Features

### For Customers
- 🎪 Browse upcoming events with beautiful UI
- 🔍 Search and filter events by category
- 🎟️ Multiple ticket types per event
- 💳 Secure payment via PayU gateway
- 📧 Instant email confirmations
- 📱 Fully responsive design

### For Administrators
- 🔐 Secure admin authentication
- 📊 Real-time analytics dashboard
- ➕ Create and manage events
- 🎫 Manage ticket types and pricing
- 📈 Track bookings and revenue
- 👥 View customer details

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
cd api && npm install && cd ..
```

### 2. Setup Environment

Copy `env-template.txt` to `.env` and configure:

```bash
# Supabase (Get from supabase.com)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# PayU (Get from PayU merchant dashboard)
VITE_PAYU_MERCHANT_KEY=your_merchant_key
VITE_PAYU_SALT=your_salt
VITE_PAYU_URL=https://test.payu.in/_payment

# Email (Gmail recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=thebot26@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=thebot26@gmail.com

VITE_BASE_URL=http://localhost:5173
```

### 3. Setup Database

1. Create Supabase project at https://supabase.com
2. Run SQL schema from `SUPABASE_SETUP.md`
3. Add credentials to `.env`

### 4. Setup Email

For Gmail (detailed in `API_SERVER_SETUP.md`):
1. Enable 2FA on Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Add to `.env` as EMAIL_PASSWORD

### 5. Start Development

**Option A: Using the startup script (Recommended)**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option B: Manual startup**

Terminal 1:
```bash
npm run dev
```

Terminal 2:
```bash
cd api && npm start
```

## 📍 Routes

### Public Routes
- `/` - Home page (with events section)
- `/events` - Event listing
- `/events/:id` - Event details
- `/events/:id/book` - Booking form
- `/payment/success` - Payment success
- `/payment/failure` - Payment failure

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard
- `/admin/events/create` - Create event
- `/admin/events/edit/:id` - Edit event

### Default Admin Credentials
```
Email: thebot26@gmail.com
Password: admin@00
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Database**: Supabase
- **Payment**: PayU Gateway
- **State**: React Hooks

### Backend (Node.js API)
- **Framework**: Express.js
- **Email**: Nodemailer
- **Protocol**: REST API
- **Port**: 3001

### Database (Supabase/PostgreSQL)
- **Events**: Event information
- **Ticket Types**: Pricing tiers
- **Bookings**: Customer orders
- **Admin Users**: Authentication

## 📊 Database Schema

```sql
events
├── id (UUID)
├── title
├── description
├── event_date
├── location
├── image_url
├── category
└── status

ticket_types
├── id (UUID)
├── event_id (FK)
├── name
├── price
├── total_quantity
└── available_quantity

bookings
├── id (UUID)
├── event_id (FK)
├── ticket_type_id (FK)
├── customer_name
├── customer_email
├── quantity
├── total_amount
├── payment_status
└── booking_reference

admin_users
├── id (UUID)
├── email
├── password_hash
└── name
```

## 🔐 Security Features

### Implemented
✅ Environment variable protection  
✅ HTTPS-ready payment gateway  
✅ Secure email transmission  
✅ SQL injection prevention (Supabase)  
✅ Input validation  
✅ Session-based admin auth  

### Production Recommendations
🔲 Implement bcrypt password hashing  
🔲 Add JWT authentication  
🔲 Enable rate limiting  
🔲 Configure CORS properly  
🔲 Add request logging  
🔲 Implement API versioning  

## 🎨 Design System

Consistent with TheBotCompany's existing design:
- **Background**: Black (#000000)
- **Accent**: Cyan (#00baff)
- **Headings**: Pixelify Sans
- **Body**: Josefin Sans
- **Animations**: Smooth transitions with Framer Motion

## 📱 Responsive Design

- Mobile-first approach
- Touch-optimized buttons (44px minimum)
- Responsive grids and layouts
- Optimized forms for small screens

## ⚡ Performance

- Lazy loading of components
- Code splitting by route
- Optimized images
- Efficient database queries
- Connection pooling (Supabase)
- Caching strategies

## 🧪 Testing

### Test Email Service
```bash
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### Test Health Check
```bash
curl http://localhost:3001/api/health
```

## 🔄 Workflow

### Customer Journey
1. Browse events → `/events`
2. Select event → `/events/:id`
3. Choose tickets
4. Enter details → `/events/:id/book`
5. Pay via PayU → External redirect
6. Receive confirmation → `/payment/success`
7. Get email with ticket

### Admin Journey
1. Login → `/admin/login`
2. View dashboard → `/admin/dashboard`
3. Create event → `/admin/events/create`
4. Manage bookings
5. Track revenue

## 📦 Key Dependencies

```json
{
  "@supabase/supabase-js": "^2.39.0",
  "react-router-dom": "^6.21.1",
  "crypto-js": "^4.2.0",
  "framer-motion": "^12.23.24",
  "express": "^4.18.2",
  "nodemailer": "^6.9.7"
}
```

## 🐛 Troubleshooting

### Issue: Events not loading
**Solution**: Check Supabase connection and credentials in `.env`

### Issue: Email not sending
**Solution**: Verify Gmail app password and API server is running

### Issue: Payment redirect fails
**Solution**: Check PayU credentials and URL configuration

### Issue: Admin login fails
**Solution**: Ensure admin user exists in Supabase database

See `IMPLEMENTATION_GUIDE.md` for detailed troubleshooting.

## 📚 Documentation

- `IMPLEMENTATION_GUIDE.md` - Complete setup and usage guide
- `SUPABASE_SETUP.md` - Database configuration
- `API_SERVER_SETUP.md` - Email server setup
- `env-template.txt` - Environment variables template

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### API Server (Railway/Heroku/DigitalOcean)
```bash
cd api
# Set environment variables
# Deploy with Node.js runtime
```

### Database
- Already hosted on Supabase
- Configure production RLS policies
- Set up backup schedule

## 🔮 Future Enhancements

- [ ] QR code ticket generation
- [ ] PDF ticket downloads
- [ ] Ticket cancellation/refunds
- [ ] Customer dashboard
- [ ] SMS notifications
- [ ] Multi-currency support
- [ ] Social media integration
- [ ] Event reminders
- [ ] Waiting list feature
- [ ] Discount codes/coupons

## 🤝 Contributing

This is a custom system built for TheBotCompany. For modifications:
1. Follow existing code style
2. Maintain design consistency
3. Test thoroughly before deploying
4. Update documentation

## 📄 License

Proprietary - TheBotCompany © 2025

## 💬 Support

**Email**: thebot26@gmail.com  
**Website**: https://thebotcompany.in

---

Built with ❤️ by TheBotCompany  
Powered by React, Supabase, PayU & Nodemailer


