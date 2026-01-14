# Email Notification Setup Guide

**100% Open Source** - Uses Nodemailer with Gmail/Outlook SMTP (Free!)

## Quick Setup (5 minutes)

### Step 1: Get Gmail App Password (Recommended)

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select **App**: Mail
4. Select **Device**: Other (Custom name) → Type "The Bot Company"
5. Click **Generate**
6. Copy the 16-character password (looks like: `abcd efgh ijkl mnop`)

**Note:** You need 2-factor authentication enabled on your Google account.

### Step 2: Create API Environment File

Create a file `api/.env`:

```bash
cd api
touch .env
```

Add this content (replace with your Gmail and app password):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
FROM_EMAIL=The Bot Company <your-email@gmail.com>
PORT=3001
```

**Alternative:** Use Outlook instead of Gmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=The Bot Company <your-email@outlook.com>
PORT=3001
```

### Step 3: Install API Dependencies

```bash
cd api
npm install
```

### Step 4: Start the API Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════╗
║  The Bot Company - Email API Server       ║
║  Status: Running                           ║
║  Port: 3001                                ║
╚═══════════════════════════════════════════╝
```

### Step 5: Start the Frontend (in a new terminal)

```bash
cd ..  # Go back to thebotcompany folder
npm run dev
```

## Testing

1. Open http://localhost:5173
2. Fill out the contact form
3. Submit the form
4. Check `tharun@thebotcompany.in` inbox for the notification email

## Running Both Servers Together

### Option 1: Two Terminals

**Terminal 1 (API Server):**
```bash
cd api
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### Option 2: Background Process

**Start API in background:**
```bash
cd api
npm start &
```

**Then start frontend:**
```bash
npm run dev
```

## Production Deployment

### For Frontend:
- Deploy to Vercel, Netlify, or your hosting
- Set `VITE_EMAIL_API_URL` environment variable to your API URL

### For API:
- Deploy to Railway, Render, or any Node.js hosting
- Set environment variables on your hosting platform
- Update `VITE_EMAIL_API_URL` in frontend to point to deployed API

## Email Features

✅ Sends to: `tharun@thebotcompany.in`  
✅ Includes: Name, Email, Phone, Country Code, Timeline, Description  
✅ Reply-to: Set to lead's email for easy replies  
✅ Beautiful HTML template  
✅ Professional design matching your brand  

## Troubleshooting

**"Failed to send email"**
- Check SMTP credentials (username and password)
- Make sure you're using App Password, not regular password
- Verify API server is running on port 3001
- Check browser console for errors

**"Invalid login" or "Authentication failed"**
- Use App Password (16 characters from Google)
- Enable 2-factor authentication on your Gmail account
- Check username is your full email address

**"Connection refused"**
- Make sure API server is running
- Check if port 3001 is available
- Verify CORS is enabled (already configured)

**Email not received**
- Check spam folder
- Verify SMTP credentials are correct
- Check API server logs for errors

## Free & Open Source

- ✅ **Nodemailer** - 100% open source, no vendor lock-in
- ✅ **Gmail/Outlook** - Free, use your existing email
- ✅ **No API keys** - Just use your email account
- ✅ **No limits** - Send as many as your account allows
- ✅ **Simple setup** - 5 minutes to configure

## Next Steps

1. ✅ Get Resend API key
2. ✅ Create `api/.env` file
3. ✅ Install dependencies (`npm install` in api folder)
4. ✅ Start API server
5. ✅ Test form submission
6. ✅ Verify email received

That's it! Your email notification system is ready! 🎉
