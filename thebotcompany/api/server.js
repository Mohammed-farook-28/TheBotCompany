// Email Notification API Server for The Bot Company
// Sends email notifications when new leads submit the contact form
// Uses Nodemailer with SMTP (Gmail, Outlook, or any SMTP server)

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file from api folder, or fallback to parent directory
dotenv.config({ path: path.join(__dirname, '.env') });
// Also try loading from parent directory (in case .env is in root)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Nodemailer transporter
// Remove spaces from password (Gmail app passwords sometimes have spaces)
const smtpPassword = process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.replace(/\s+/g, '') : '';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: smtpPassword,
  },
});

// Debug: Log SMTP config (without password)
console.log('📧 SMTP Configuration:');
console.log('   Host:', process.env.SMTP_HOST || 'smtp.gmail.com');
console.log('   Port:', process.env.SMTP_PORT || '587');
console.log('   User:', process.env.SMTP_USER || 'NOT SET');
console.log('   Password:', smtpPassword ? '***SET***' : 'NOT SET');

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP configuration error:', error.message);
    console.log('⚠️  Please check your SMTP credentials in .env file');
  } else {
    console.log('✅ SMTP server is ready to send emails');
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Email API server is running',
    timestamp: new Date().toISOString(),
  });
});

// Send lead notification email
app.post('/api/send-lead-notification', async (req, res) => {
  try {
    const {
      name,
      email,
      countryCode,
      phone,
      timeline,
      description,
    } = req.body;

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required',
      });
    }

    // Format phone number for display
    const fullPhone = countryCode && phone 
      ? `${countryCode} ${phone}` 
      : (phone || countryCode || 'Not provided');

    // Format timeline
    const timelineLabels = {
      'asap': 'ASAP (Rush job)',
      '1-month': 'Within 1 month',
      '2-3-months': '2-3 months',
      '3-6-months': '3-6 months',
      'flexible': 'Flexible timeline',
    };
    const timelineDisplay = timelineLabels[timeline] || timeline || 'Not specified';

    // Google Sheets URL
    const GOOGLE_SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1jpoc-W1fsIPSpH6uenmi4hoQoXocRZoTAmg6TpJOgwI/edit?usp=sharing';

    // Create email HTML with elegant black and white theme
    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Lead - The Bot Company</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #d0d0d0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
      border-bottom: 2px solid #2a2a2a;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: 0.5px;
      color: #ffffff;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 12px;
      color: #e0e0e0;
      font-weight: 400;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .content {
      padding: 40px 30px;
      background-color: #ffffff;
    }
    .greeting {
      color: #1a1a1a;
      font-size: 16px;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .intro-text {
      color: #555555;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .lead-info {
      background-color: #fafafa;
      border: 1px solid #e5e5e5;
      border-left: 3px solid #888888;
      border-radius: 6px;
      padding: 25px;
      margin: 25px 0;
    }
    .info-row {
      display: flex;
      padding: 14px 0;
      border-bottom: 1px solid #ededed;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      width: 140px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      color: #777777;
      letter-spacing: 0.5px;
    }
    .info-value {
      flex: 1;
      font-size: 14px;
      color: #1a1a1a;
      word-break: break-word;
      font-weight: 400;
    }
    .info-value a {
      color: #1a1a1a;
      text-decoration: underline;
      text-decoration-color: #999999;
      font-weight: 500;
    }
    .info-value a:hover {
      color: #000000;
      text-decoration-color: #666666;
    }
    .description-box {
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      padding: 16px;
      margin-top: 10px;
      font-size: 14px;
      color: #2a2a2a;
      line-height: 1.7;
      white-space: pre-wrap;
    }
    .cta-section {
      text-align: center;
      margin: 35px 0 25px 0;
    }
    .cta-button {
      display: inline-block;
      background-color: #000000 !important;
      color: #ffffff !important;
      padding: 14px 28px;
      text-decoration: none !important;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.3px;
      text-transform: uppercase;
      border: 1px solid #000000 !important;
    }
    .cta-button:hover {
      background-color: #1a1a1a !important;
      border-color: #1a1a1a !important;
      color: #ffffff !important;
    }
    .cta-button:link,
    .cta-button:visited,
    .cta-button:active {
      color: #ffffff !important;
      text-decoration: none !important;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #999999;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 4px 0;
    }
    .timestamp {
      color: #666666;
      font-weight: 400;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, #d0d0d0, transparent);
      margin: 25px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Lead Received</h1>
      <p>The Bot Company</p>
    </div>
    
    <div class="content">
      <div class="greeting">Hello Team,</div>
      <div class="intro-text">A new lead has submitted the contact form. Please review the details below and follow up promptly.</div>
      
      <div class="divider"></div>
      
      <div class="lead-info">
        <div class="info-row">
          <div class="info-label">Name</div>
          <div class="info-value">${escapeHtml(name)}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Email</div>
          <div class="info-value"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></div>
        </div>
        
        ${countryCode ? `
        <div class="info-row">
          <div class="info-label">Country Code</div>
          <div class="info-value">${escapeHtml(countryCode)}</div>
        </div>
        ` : ''}
        
        <div class="info-row">
          <div class="info-label">Phone</div>
          <div class="info-value">${escapeHtml(fullPhone)}</div>
        </div>
        
        <div class="info-row">
          <div class="info-label">Timeline</div>
          <div class="info-value">${escapeHtml(timelineDisplay)}</div>
        </div>
        
        ${description ? `
        <div class="info-row">
          <div class="info-label">Description</div>
          <div class="info-value">
            <div class="description-box">${escapeHtml(description)}</div>
          </div>
        </div>
        ` : ''}
      </div>
      
      <div class="cta-section">
        <a href="${GOOGLE_SHEETS_URL}" class="cta-button" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px; letter-spacing: 0.3px; text-transform: uppercase; border: 1px solid #000000;">
          View in Google Sheets
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>Automated notification from The Bot Company Lead System</p>
      <p class="timestamp">Timestamp: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send email using Nodemailer (SMTP)
    // Send to all admin emails
    const adminEmails = [
      'tharun@thebotcompany.in',
      'madhan@thebotcompany.in',
      'thebot@thebotcompany.in'
    ];

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'The Bot Company <noreply@thebotcompany.in>',
      to: adminEmails, // Send to all admins
      subject: `New Lead: ${name} - The Bot Company`,
      html: emailHTML,
      replyTo: email, // Set reply-to as the lead's email for easy replies
    };

    console.log('📧 Attempting to send email...');
    console.log('   From:', mailOptions.from);
    console.log('   To:', mailOptions.to);
    console.log('   Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully!');
    console.log('   Message ID:', info.messageId);
    console.log('   Response:', info.response);
    console.log('   Accepted:', info.accepted);
    console.log('   Rejected:', info.rejected);

    res.json({
      success: true,
      message: 'Email notification sent successfully',
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email notification',
      error: error.message,
    });
  }
});

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  The Bot Company - Email API Server       ║
║  Status: Running                           ║
║  Port: ${PORT}                              ║
║  SMTP: ${process.env.SMTP_HOST || 'smtp.gmail.com'} ║
║  Endpoint: /api/send-lead-notification     ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;
