// Backend API server for email notifications using Nodemailer
// Run this separately from your Vite dev server using: node api/server.js

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter configuration error:', error);
  } else {
    console.log('✓ Email server is ready to send messages');
  }
});

// Generate ticket email HTML
const generateTicketEmailHTML = (details) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Event Ticket - ULA Experiences</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #000000;
      color: #ffffff;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #000000;
      border: 1px solid #00baff;
      border-radius: 12px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #00baff 0%, #0088cc 100%);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #000000;
      font-size: 28px;
      font-weight: bold;
    }
    .content {
      padding: 30px;
    }
    .ticket-card {
      background-color: #0a0a0a;
      border: 2px solid #00baff;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
    .booking-ref {
      font-size: 24px;
      font-weight: bold;
      color: #00baff;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 2px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #333;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #999;
      font-weight: 600;
    }
    .detail-value {
      color: #ffffff;
      font-weight: 700;
    }
    .total-amount {
      background-color: #00baff;
      color: #000000;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
      font-weight: bold;
    }
    .footer {
      background-color: #0a0a0a;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Your Ticket Confirmed!</h1>
      <p style="margin: 10px 0 0 0; color: #000000;">ULA Experiences</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6;">Hi ${details.customerName},</p>
      <p style="font-size: 16px; line-height: 1.6;">
        Thank you for booking with ULA Experiences! Your ticket has been confirmed. 
        Please keep this email safe and present your booking reference at the venue.
      </p>
      
      <div class="booking-ref">
        ${details.bookingReference}
      </div>
      
      <div class="ticket-card">
        <h2 style="color: #00baff; margin-top: 0;">Event Details</h2>
        
        <div class="detail-row">
          <span class="detail-label">Event:</span>
          <span class="detail-value">${details.eventTitle}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Date & Time:</span>
          <span class="detail-value">${new Date(details.eventDate).toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Location:</span>
          <span class="detail-value">${details.eventLocation}</span>
        </div>
        
        ${details.venueAddress ? `
        <div class="detail-row">
          <span class="detail-label">Venue:</span>
          <span class="detail-value">${details.venueAddress}</span>
        </div>
        ` : ''}
        
        <div class="detail-row">
          <span class="detail-label">Ticket Type:</span>
          <span class="detail-value">${details.ticketType}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Quantity:</span>
          <span class="detail-value">${details.quantity} ticket(s)</span>
        </div>
      </div>
      
      <div class="total-amount">
        Total Paid: ₹${parseFloat(details.totalAmount).toFixed(2)}
      </div>
      
      <div style="background-color: #0a0a0a; padding: 20px; border-radius: 8px; border-left: 4px solid #00baff;">
        <h3 style="color: #00baff; margin-top: 0;">Important Information:</h3>
        <ul style="color: #ccc; line-height: 1.8;">
          <li>Please arrive 30 minutes before the event starts</li>
          <li>Carry a valid photo ID for verification</li>
          <li>Show this email or booking reference at the entrance</li>
          <li>Tickets are non-transferable and non-refundable</li>
        </ul>
      </div>
      
      <p style="margin-top: 30px; color: #999; font-size: 14px;">
        Need help? Contact us at <a href="mailto:thebot26@gmail.com" style="color: #00baff;">thebot26@gmail.com</a>
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;">© 2025 ULA Experiences</p>
      <p style="margin: 5px 0;">Powered by TheBotCompany</p>
      <p style="margin: 10px 0; font-size: 11px;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

// Email sending endpoint
app.post('/api/send-ticket-email', async (req, res) => {
  try {
    const {
      bookingReference,
      customerName,
      customerEmail,
      eventTitle,
      eventDate,
      eventLocation,
      ticketType,
      quantity,
      totalAmount,
      venueAddress,
    } = req.body;

    // Validate required fields
    if (!customerEmail || !bookingReference || !eventTitle) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const emailHTML = generateTicketEmailHTML({
      bookingReference,
      customerName,
      customerEmail,
      eventTitle,
      eventDate,
      eventLocation,
      ticketType,
      quantity,
      totalAmount,
      venueAddress,
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"ULA Experiences" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Your Ticket for ${eventTitle} - Booking ${bookingReference}`,
      html: emailHTML,
      text: `Your booking for ${eventTitle} is confirmed. Booking Reference: ${bookingReference}. Total Amount: ₹${totalAmount}`,
    });

    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
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

// Test email endpoint (for testing only, remove in production)
app.post('/api/test-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    await transporter.sendMail({
      from: `"ULA Experiences" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Test Email from ULA Event System',
      html: '<h1>Test Email</h1><p>If you received this, your email configuration is working correctly!</p>',
    });

    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║  ULA Event Booking Email API Server      ║
║  Status: Running                          ║
║  Port: ${PORT}                              ║
║  Email: ${process.env.EMAIL_USER || 'Not configured'}        ║
╚═══════════════════════════════════════════╝
  `);
});

export default app;


