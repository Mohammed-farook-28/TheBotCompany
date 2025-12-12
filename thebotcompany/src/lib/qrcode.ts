// QR Code generation utilities
import QRCode from 'qrcode';

export interface TicketQRData {
  bookingReference: string;
  customerName: string;
  eventTitle: string;
  eventDate: string;
  ticketType: string;
  quantity: number;
}

export const generateQRCode = async (data: TicketQRData): Promise<string> => {
  try {
    // Create a formatted string with ticket data
    const qrContent = JSON.stringify({
      ref: data.bookingReference,
      name: data.customerName,
      event: data.eventTitle,
      date: data.eventDate,
      type: data.ticketType,
      qty: data.quantity,
      verified: true,
    });

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrContent, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H', // High error correction
    });

    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
};

// Generate QR code for email attachment
export const generateQRCodeBuffer = async (data: TicketQRData): Promise<Buffer> => {
  try {
    const qrContent = JSON.stringify({
      ref: data.bookingReference,
      name: data.customerName,
      event: data.eventTitle,
      date: data.eventDate,
      type: data.ticketType,
      qty: data.quantity,
      verified: true,
    });

    const buffer = await QRCode.toBuffer(qrContent, {
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'H',
    });

    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw error;
  }
};

// Verify QR code data
export const verifyQRCode = (qrData: string): TicketQRData | null => {
  try {
    const data = JSON.parse(qrData);
    if (data.verified && data.ref) {
      return {
        bookingReference: data.ref,
        customerName: data.name,
        eventTitle: data.event,
        eventDate: data.date,
        ticketType: data.type,
        quantity: data.qty,
      };
    }
    return null;
  } catch (error) {
    console.error('Invalid QR code data:', error);
    return null;
  }
};


