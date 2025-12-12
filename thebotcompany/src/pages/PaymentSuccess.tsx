import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Mail, Home, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabase';
import { validatePayUResponse } from '../lib/payment';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      // Get payment response parameters from URL
      const paymentData: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        paymentData[key] = value;
      });

      // Validate PayU response hash
      const isValid = validatePayUResponse(paymentData);
      
      if (!isValid || paymentData.status !== 'success') {
        navigate('/payment/failure');
        return;
      }

      // Update booking status in database
      const { data: booking, error } = await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          payment_id: paymentData.mihpayid,
          payu_transaction_id: paymentData.txnid,
        })
        .eq('booking_reference', paymentData.txnid)
        .select('*, events(*), ticket_types(*)')
        .single();

      if (error) throw error;

      setBookingDetails(booking);

      // Send email notification (call backend API)
      try {
        await fetch('/api/send-ticket-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingReference: booking.booking_reference,
            customerName: booking.customer_name,
            customerEmail: booking.customer_email,
            eventTitle: booking.events.title,
            eventDate: booking.events.event_date,
            eventLocation: booking.events.location,
            ticketType: booking.ticket_types.name,
            quantity: booking.quantity,
            totalAmount: booking.total_amount,
            venueAddress: booking.events.venue_name,
          }),
        });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        // Don't fail the whole process if email fails
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      navigate('/payment/failure');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00baff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black border border-[#00baff] rounded-xl p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <CheckCircle className="w-20 h-20 text-[#00baff] mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Payment Successful!
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg mb-8"
          >
            Your ticket has been confirmed. Check your email for details.
          </motion.p>

          {/* Booking Reference */}
          {bookingDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#00baff]/10 border border-[#00baff]/30 rounded-lg p-6 mb-8"
            >
              <p className="text-white/70 text-sm mb-2">Booking Reference</p>
              <p className="text-2xl font-bold text-[#00baff] tracking-wider">
                {bookingDetails.booking_reference}
              </p>
            </motion.div>
          )}

          {/* QR Code */}
          {bookingDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <div className="bg-white rounded-xl p-6 inline-block">
                <QRCodeSVG
                  value={JSON.stringify({
                    ref: bookingDetails.booking_reference,
                    name: bookingDetails.customer_name,
                    event: bookingDetails.events.title,
                    date: bookingDetails.events.event_date,
                    type: bookingDetails.ticket_types.name,
                    qty: bookingDetails.quantity,
                    verified: true,
                  })}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-white/60 text-sm mt-3">
                <QrCode className="w-4 h-4 inline mr-1" />
                Scan this QR code at the venue for quick check-in
              </p>
            </motion.div>
          )}

          {/* Event Details */}
          {bookingDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-black border border-white/20 rounded-lg p-6 mb-8 text-left"
            >
              <h3 className="font-bold text-lg mb-4 text-center">Event Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/70">Event:</span>
                  <span className="font-semibold">{bookingDetails.events.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Date:</span>
                  <span className="font-semibold">
                    {new Date(bookingDetails.events.event_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Ticket Type:</span>
                  <span className="font-semibold">{bookingDetails.ticket_types.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Quantity:</span>
                  <span className="font-semibold">{bookingDetails.quantity}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-white/20">
                  <span className="text-white/70">Total Paid:</span>
                  <span className="font-bold text-[#00baff] text-lg">
                    ₹{bookingDetails.total_amount}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Notification */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 text-white/60 mb-8"
          >
            <Mail className="w-5 h-5" />
            <p className="text-sm">
              Ticket details sent to {bookingDetails?.customer_email}
            </p>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="bg-[#00baff]/10 border border-[#00baff]/30 rounded-lg p-4 mb-8"
          >
            <p className="text-white/80 text-sm mb-2">Need help with your booking?</p>
            <div className="flex flex-wrap gap-4 justify-center text-sm">
              <a href="tel:+919025439428" className="text-[#00baff] hover:underline">
                📞 +91 90254 39428
              </a>
              <a href="mailto:thebot26@gmail.com" className="text-[#00baff] hover:underline">
                ✉️ thebot26@gmail.com
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/events')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
            >
              <Home className="w-5 h-5" />
              Browse More Events
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-[#00baff] transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

