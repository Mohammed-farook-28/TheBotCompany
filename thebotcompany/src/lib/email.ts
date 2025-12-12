// Email service using Nodemailer
// Note: This should be called from a backend API endpoint, not directly from frontend
// For security, email credentials should never be exposed to the client

export interface EmailTicketDetails {
  bookingReference: string;
  customerName: string;
  customerEmail: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  venueAddress?: string;
}

export const generateTicketEmailHTML = (details: EmailTicketDetails): string => {
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
    .button {
      display: inline-block;
      background-color: #00baff;
      color: #000000;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
    }
    .qr-placeholder {
      text-align: center;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      margin: 20px 0;
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
            minute: '2-digit'
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
        Total Paid: ₹${details.totalAmount.toFixed(2)}
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <p style="color: #999; margin-bottom: 10px;">Scan this QR code at the venue for quick check-in:</p>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 12px; display: inline-block;">
          <div style="width: 250px; height: 250px; display: flex; align-items: center; justify-center; background: white;">
            <!-- QR Code will be embedded here by the backend -->
            <p style="color: #666; margin: 0; font-size: 12px;">QR Code: ${details.bookingReference}</p>
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin: 10px 0 0 0;">
          Booking Reference: <strong style="color: #00baff;">${details.bookingReference}</strong>
        </p>
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

export const generateTicketEmailText = (details: EmailTicketDetails): string => {
  return `
Your Event Ticket - ULA Experiences

Hi ${details.customerName},

Thank you for booking with ULA Experiences! Your ticket has been confirmed.

Booking Reference: ${details.bookingReference}

EVENT DETAILS:
Event: ${details.eventTitle}
Date & Time: ${new Date(details.eventDate).toLocaleString()}
Location: ${details.eventLocation}
${details.venueAddress ? `Venue: ${details.venueAddress}` : ''}
Ticket Type: ${details.ticketType}
Quantity: ${details.quantity} ticket(s)

Total Paid: ₹${details.totalAmount.toFixed(2)}

IMPORTANT INFORMATION:
- Please arrive 30 minutes before the event starts
- Carry a valid photo ID for verification
- Show this email or booking reference at the entrance
- Tickets are non-transferable and non-refundable

Need help? Contact us at thebot26@gmail.com

© 2025 ULA Experiences
Powered by TheBotCompany
  `;
};

// API endpoint interface (to be implemented in backend)
export interface SendEmailRequest {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export const sendTicketEmail = async (details: EmailTicketDetails): Promise<boolean> => {
  try {
    const emailData: SendEmailRequest = {
      to: details.customerEmail,
      subject: `Your Ticket for ${details.eventTitle} - Booking ${details.bookingReference}`,
      html: generateTicketEmailHTML(details),
      text: generateTicketEmailText(details),
    };

    // Call your backend API endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

