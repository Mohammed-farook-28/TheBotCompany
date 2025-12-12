# 🎫 ULA Event Booking System - Quick Start

## What Was Built

A complete event ticket booking system has been integrated into your TheBotCompany website with:

### ✅ Complete Features
1. **Event Management System** - Like BookMyShow/District
2. **Multiple Ticket Types** - Early Bird, Regular, VIP, etc.
3. **PayU Payment Integration** - Secure payment gateway
4. **Email Notifications** - Automatic ticket emails via Nodemailer (free)
5. **Admin Panel** - Full event and booking management
6. **Supabase Database** - Scalable PostgreSQL database
7. **Responsive Design** - Works perfectly on all devices

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies (2 minutes)

```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany
npm install
```

### Step 2: Setup Supabase (5 minutes)

1. Go to https://supabase.com
2. Create new project (free tier is fine)
3. Go to Project Settings → API
4. Copy your `Project URL` and `anon public` key
5. Go to SQL Editor
6. Copy and run the SQL from `SUPABASE_SETUP.md`

### Step 3: Setup Gmail for Emails (3 minutes)

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "ULA Events"
4. Copy the 16-character password

### Step 4: Configure Environment (2 minutes)

Create `.env` file in the root directory:

```env
# Supabase (paste your values)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx...

# PayU (add later when you have credentials)
VITE_PAYU_MERCHANT_KEY=
VITE_PAYU_SALT=
VITE_PAYU_URL=https://test.payu.in/_payment

# Email (paste your Gmail app password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=thebot26@gmail.com
EMAIL_PASSWORD=your_16_char_app_password
EMAIL_FROM=thebot26@gmail.com

# Base URL
VITE_BASE_URL=http://localhost:5173
```

### Step 5: Run the System (1 minute)

```bash
# Easy way - Run both servers at once
./start-dev.sh

# Or manually in two terminals:
# Terminal 1:
npm run dev

# Terminal 2:
cd api && npm install && npm start
```

## 🎉 You're Live!

Open http://localhost:5173 to see your website with the new Events section.

### Try These URLs:

- **Main Site**: http://localhost:5173
- **Events Page**: http://localhost:5173/events
- **Admin Login**: http://localhost:5173/admin/login
  - Email: `thebot26@gmail.com`
  - Password: `admin@00`

## 📝 Create Your First Event

1. Go to http://localhost:5173/admin/login
2. Login with the credentials above
3. Click "Create Event" button
4. Fill in the details:
   ```
   Title: Tech Conference 2025
   Description: Join us for the biggest tech conference...
   Date: Choose a future date
   Location: Mumbai, India
   Venue: Convention Center
   Image URL: https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800
   Category: conference
   Status: active
   ```
5. Add ticket types:
   ```
   Ticket 1:
   - Name: Early Bird
   - Price: 999
   - Quantity: 100
   
   Ticket 2:
   - Name: Regular
   - Price: 1499
   - Quantity: 200
   
   Ticket 3:
   - Name: VIP
   - Price: 2999
   - Quantity: 50
   ```
6. Click "Create Event"

## 🧪 Test the System

1. **View Event**: Go to `/events` and click on your event
2. **Select Tickets**: Choose quantities for different ticket types
3. **Book Tickets**: Fill in customer details
4. **Test Email**: The email will be sent when payment succeeds

## 💳 Add PayU Credentials Later

When you get your PayU merchant account:

1. Login to PayU dashboard
2. Get your Merchant Key and Salt
3. Add to `.env`:
   ```env
   VITE_PAYU_MERCHANT_KEY=your_key
   VITE_PAYU_SALT=your_salt
   ```
4. For production, change URL to:
   ```env
   VITE_PAYU_URL=https://secure.payu.in/_payment
   ```

## 📊 System Overview

### What You Can Do Now

**As Admin:**
- Create/edit/delete events
- Set multiple ticket prices
- Track all bookings
- See revenue statistics
- View customer details

**For Customers:**
- Browse events by category
- Search events
- Book multiple tickets
- Pay securely via PayU
- Receive ticket via email
- View booking confirmation

### Database Tables Created

1. **events** - Your event information
2. **ticket_types** - Different price tiers per event
3. **bookings** - All customer bookings
4. **admin_users** - Admin login credentials

### Pages Created

**Public Pages:**
- Event listing with search/filter
- Event detail with ticket selection
- Booking form with customer details
- Payment success/failure pages

**Admin Pages:**
- Secure login
- Dashboard with statistics
- Event management (CRUD)
- Booking management

## 🎨 Design

Everything matches your existing website style:
- Black background with cyan (#00baff) accents
- Smooth Framer Motion animations
- Pixelify Sans headings
- Josefin Sans body text
- Fully responsive on all devices

## 🔒 Security (Important!)

### Current Setup: DEVELOPMENT MODE

✅ Good for testing and development  
❌ NOT ready for production

### Before Going Live:

1. **Change admin password** - Currently it's plain text
2. **Add password hashing** - Use bcrypt
3. **Configure CORS** - Limit to your domain
4. **Enable HTTPS** - Required for production
5. **Add rate limiting** - Prevent abuse
6. **Review RLS policies** - Supabase security

See `IMPLEMENTATION_GUIDE.md` for the complete production checklist.

## 📚 Documentation

I've created comprehensive guides:

1. **QUICK_START.md** (this file) - Get started fast
2. **ULA_EVENTS_README.md** - Complete system overview
3. **IMPLEMENTATION_GUIDE.md** - Detailed implementation guide
4. **SUPABASE_SETUP.md** - Database setup instructions
5. **API_SERVER_SETUP.md** - Email server configuration

## 🐛 Common Issues

### "Cannot find module" errors
```bash
npm install
cd api && npm install
```

### Events not showing
- Check Supabase connection in `.env`
- Verify you created events in admin panel
- Check browser console for errors

### Email not sending
- Verify Gmail app password is correct
- Ensure API server is running on port 3001
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`

### Admin login fails
- Check Supabase has admin user (run SQL setup)
- Verify credentials: thebot26@gmail.com / admin@00

## 🔮 What's Next?

### Immediate (Do This Now)
1. ✅ Install dependencies
2. ✅ Setup Supabase
3. ✅ Configure Gmail
4. ✅ Create `.env` file
5. ✅ Start the servers
6. ✅ Create your first event
7. ✅ Test booking flow

### Soon
1. Get PayU merchant account
2. Add your real event images
3. Create your actual events
4. Test complete payment flow
5. Share with customers

### Before Production
1. Review security checklist
2. Implement production changes
3. Test thoroughly
4. Deploy to hosting
5. Configure domain
6. Monitor and optimize

## 💡 Pro Tips

1. **Free Images**: Use Unsplash for event images
   - Conference: https://unsplash.com/s/photos/conference
   - Workshop: https://unsplash.com/s/photos/workshop
   - Concert: https://unsplash.com/s/photos/concert

2. **Test Email**: Always test email before going live
   ```bash
   curl -X POST http://localhost:3001/api/test-email \
     -H "Content-Type: application/json" \
     -d '{"email": "your-email@example.com"}'
   ```

3. **Backup Database**: Supabase has automatic backups, but:
   - Go to Database → Backups
   - Enable daily backups
   - Test restore process

4. **Monitor Logs**: Keep both terminal windows visible to see:
   - Frontend errors (Terminal 1)
   - Email sending status (Terminal 2)

## 🆘 Need Help?

**Got stuck?** Check these files:
- `IMPLEMENTATION_GUIDE.md` - Detailed troubleshooting
- `API_SERVER_SETUP.md` - Email issues
- `SUPABASE_SETUP.md` - Database issues

**Still need help?**
- Email: thebot26@gmail.com
- Check console logs in browser (F12)
- Check terminal output for errors

## ✨ Features Checklist

- ✅ Event listing page (like BookMyShow)
- ✅ Event detail page with ticket selection
- ✅ Multiple ticket types per event
- ✅ Shopping cart functionality
- ✅ Customer booking form
- ✅ PayU payment integration
- ✅ Email confirmation with ticket details
- ✅ Admin authentication
- ✅ Admin dashboard with stats
- ✅ Event management (create/edit/delete)
- ✅ Booking management
- ✅ Responsive design
- ✅ Your website's UI style
- ✅ Smooth animations
- ✅ Supabase database
- ✅ Free email service (Nodemailer)
- ✅ Race condition handling
- ✅ Multi-pod ready

## 🎊 You're All Set!

Your complete event booking system is ready. Follow the 5 steps above and you'll be managing events in minutes!

**Remember:** This is running in development mode. Follow the production checklist before going live with real customers.

---

**Built for TheBotCompany**  
Event booking made simple 🎫


