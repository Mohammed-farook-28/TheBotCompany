# Email Notification API

This API server sends email notifications to `tharun@thebotcompany.in` whenever a new lead submits the contact form.

**100% Open Source** - Uses Nodemailer with SMTP (Gmail, Outlook, or any SMTP server)

## Setup Instructions

### Option 1: Gmail (Recommended - Free & Easy)

1. Go to https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select **App**: Mail
4. Select **Device**: Other (Custom name) → Enter "The Bot Company"
5. Click **Generate**
6. Copy the 16-character password (you'll see something like `abcd efgh ijkl mnop`)

### Option 2: Outlook/Hotmail (Free)

1. Go to https://account.microsoft.com/security
2. Enable 2-factor authentication
3. Go to https://account.microsoft.com/security/app-passwords
4. Create a new app password
5. Copy the password

### Configure Environment Variables

Create a `.env` file in the `api` folder:

**For Gmail:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
FROM_EMAIL=The Bot Company <your-email@gmail.com>
PORT=3001
```

**For Outlook:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=The Bot Company <your-email@outlook.com>
PORT=3001
```

### 3. Install Dependencies

```bash
cd api
npm install
```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001`

### 5. Update Frontend Environment (Optional)

If your API is running on a different URL, add to your `.env` file in the root:

```env
VITE_EMAIL_API_URL=http://localhost:3001/api/send-lead-notification
```

For production, use your deployed API URL.

## How It Works

1. User submits the contact form
2. Form data is sent to Google Sheets (existing functionality)
3. Form data is also sent to this API endpoint
4. API sends a beautifully formatted email to `tharun@thebotcompany.in`
5. Email includes all lead details with a "Reply to Lead" button

## API Endpoints

### POST `/api/send-lead-notification`

Sends an email notification when a new lead is received.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "countryCode": "+91",
  "phone": "9876543210",
  "timeline": "1-month",
  "description": "I want to build a website"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email notification sent successfully",
  "emailId": "abc123"
}
```

### GET `/api/health`

Health check endpoint to verify the server is running.

## Email Features

- ✅ Beautiful HTML email template
- ✅ All lead details included
- ✅ Reply-to set to lead's email for easy replies
- ✅ Responsive design
- ✅ Professional branding

## Troubleshooting

### Email not sending?

1. **Check SMTP credentials** - Verify username and password are correct
2. **Gmail App Password** - Make sure you're using an App Password, not your regular Gmail password
3. **2FA Required** - Gmail/Outlook require 2-factor authentication for app passwords
4. **Check server logs** - Look for SMTP error messages in the console
5. **Firewall/Port** - Ensure port 587 is not blocked

### Common Errors

**"Invalid login"**
- Use App Password, not regular password
- Check username is correct (full email address)

**"Connection timeout"**
- Check SMTP_HOST and SMTP_PORT are correct
- Verify internet connection
- Check firewall settings

**"Authentication failed"**
- Enable 2-factor authentication on your email account
- Generate a new app password
- Make sure no extra spaces in password

## Free & Open Source

- ✅ **Nodemailer** - 100% open source
- ✅ **Gmail** - Free, unlimited emails (with your account)
- ✅ **No API keys needed** - Just use your email account
- ✅ **No limits** - Send as many emails as your account allows
