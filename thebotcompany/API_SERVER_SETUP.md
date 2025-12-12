# Email API Server Setup Guide

This guide explains how to set up and run the Nodemailer email API server for the ULA Event Booking System.

## Prerequisites

- Node.js installed (v16 or higher)
- Gmail account or SMTP server credentials
- Environment variables configured

## Gmail Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### Step 2: Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "ULA Event System"
4. Copy the generated 16-character password
5. Add this to your `.env` file as `EMAIL_PASSWORD`

## Environment Variables

Create a `.env` file in the root directory with:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=thebot26@gmail.com
EMAIL_PASSWORD=your_app_specific_password_here
EMAIL_FROM=thebot26@gmail.com
```

## Installation

```bash
# Navigate to the api directory
cd api

# Install dependencies
npm install

# Or if dependencies are in root:
cd /Users/bot/Desktop/TheBotCompany/thebotcompany
npm install express nodemailer cors dotenv
```

## Running the Server

### Development Mode (with auto-reload)

```bash
cd api
npm run dev
```

### Production Mode

```bash
cd api
npm start
```

The server will run on `http://localhost:3001` by default.

## Testing the Email Service

### Test Email Endpoint

Send a POST request to test your email configuration:

```bash
curl -X POST http://localhost:3001/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "your-email@example.com"}'
```

### Health Check

```bash
curl http://localhost:3001/api/health
```

## API Endpoints

### 1. Send Ticket Email

**Endpoint:** `POST /api/send-ticket-email`

**Request Body:**
```json
{
  "bookingReference": "ULA-abc123-XYZ",
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "eventTitle": "Tech Conference 2025",
  "eventDate": "2025-03-15T14:00:00Z",
  "eventLocation": "New York",
  "ticketType": "Early Bird",
  "quantity": 2,
  "totalAmount": 199.98,
  "venueAddress": "Convention Center"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<unique-message-id>"
}
```

### 2. Health Check

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "message": "Email API server is running",
  "timestamp": "2025-12-10T10:30:00.000Z"
}
```

### 3. Test Email (Development Only)

**Endpoint:** `POST /api/test-email`

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

## Running with Vite Dev Server

You need to run both servers simultaneously:

### Terminal 1 - Vite Dev Server
```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany
npm run dev
```

### Terminal 2 - Email API Server
```bash
cd /Users/bot/Desktop/TheBotCompany/thebotcompany/api
npm start
```

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start the API server
pm2 start api/server.js --name ula-email-api

# View logs
pm2 logs ula-email-api

# Restart
pm2 restart ula-email-api
```

### Environment Variables in Production

Make sure to set these environment variables on your production server:
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`
- `EMAIL_FROM`
- `PORT` (optional, defaults to 3001)

## CORS Configuration

The API allows all origins by default. In production, update the CORS configuration in `server.js`:

```javascript
app.use(cors({
  origin: 'https://your-domain.com',
  credentials: true
}));
```

## Troubleshooting

### Email Not Sending

1. **Check Gmail App Password:** Ensure you're using an app-specific password, not your regular Gmail password
2. **Check Port:** Port 587 should be open on your server
3. **Check Credentials:** Verify EMAIL_USER and EMAIL_PASSWORD in .env
4. **Check Logs:** View server console for detailed error messages

### Connection Refused

1. Make sure the API server is running on port 3001
2. Check if port 3001 is available (not used by another process)
3. Update the API URL in your frontend if using a different port

### CORS Errors

1. Ensure the API server is running
2. Check CORS configuration in server.js
3. Verify the frontend is making requests to the correct URL

## Security Considerations

### Production Checklist

- [ ] Remove test email endpoint
- [ ] Configure CORS to allow only your frontend domain
- [ ] Use environment variables for all sensitive data
- [ ] Enable rate limiting to prevent abuse
- [ ] Use HTTPS in production
- [ ] Consider using a professional email service (SendGrid, Mailgun) for higher volume

### Rate Limiting (Optional)

Install and configure express-rate-limit:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
});

app.use('/api/', limiter);
```

## Alternative Email Services

If you prefer not to use Gmail, you can use:

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=your_mailgun_username
EMAIL_PASSWORD=your_mailgun_password
```

### AWS SES
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_ses_access_key
EMAIL_PASSWORD=your_ses_secret_key
```

## Support

For issues or questions, contact: thebot26@gmail.com


