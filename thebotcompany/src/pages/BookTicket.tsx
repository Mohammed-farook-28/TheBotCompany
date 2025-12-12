import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, CreditCard, ArrowLeft, Lock, Search } from 'lucide-react';
import { supabase, Event, TicketType } from '../lib/supabase';
import { generateBookingReference, initiatePayUPayment } from '../lib/payment';

interface BookingState {
  event: Event;
  selectedTickets: Array<{ ticketId: string; quantity: number }>;
  ticketTypes: TicketType[];
  totalAmount: number;
}

const BookTicket = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const bookingData = location.state as BookingState;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [countrySearch, setCountrySearch] = useState('');

  // Country codes (reusing from ContactForm)
  const allCountryCodes = [
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    // Add more as needed
  ];

  const filteredCountryCodes = countrySearch
    ? allCountryCodes.filter(
        (c) =>
          c.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
          c.code.includes(countrySearch)
      )
    : allCountryCodes;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid booking session</h2>
          <button
            onClick={() => navigate('/events')}
            className="px-6 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const bookingReference = generateBookingReference();

      // Create booking records for each ticket type
      for (const selectedTicket of bookingData.selectedTickets) {
        const ticketType = bookingData.ticketTypes.find((t) => t.id === selectedTicket.ticketId);
        if (!ticketType) continue;

        const bookingAmount = ticketType.price * selectedTicket.quantity;

        // Insert booking into database
        const { error: bookingError } = await supabase.from('bookings').insert({
          event_id: bookingData.event.id,
          ticket_type_id: selectedTicket.ticketId,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: `${formData.countryCode}${formData.phone}`,
          quantity: selectedTicket.quantity,
          total_amount: bookingAmount,
          payment_status: 'pending',
          booking_reference: bookingReference,
        });

        if (bookingError) throw bookingError;

        // Update available quantity (with race condition handling)
        const { error: updateError } = await supabase
          .from('ticket_types')
          .update({
            available_quantity: ticketType.available_quantity - selectedTicket.quantity,
          })
          .eq('id', selectedTicket.ticketId)
          .gte('available_quantity', selectedTicket.quantity); // Ensures we don't oversell

        if (updateError) {
          // Rollback booking if quantity update fails
          await supabase.from('bookings').delete().eq('booking_reference', bookingReference);
          throw new Error('Tickets no longer available. Please try again.');
        }
      }

      // Initiate PayU payment
      initiatePayUPayment({
        bookingReference,
        amount: bookingData.totalAmount,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: `${formData.countryCode}${formData.phone}`,
        eventTitle: bookingData.event.title,
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.message || 'Failed to create booking. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 font-['Josefin_Sans']">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/70 hover:text-[#00baff] transition-colors mb-6 sm:mb-8 touch-manipulation"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Order Summary - Mobile First (Show at top on mobile) */}
        <div className="lg:hidden mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border-2 border-[#00baff] rounded-xl p-5"
          >
            <h3 className="text-xl font-bold mb-4">Order Summary</h3>
            
            {/* Event Info */}
            <div className="mb-4 pb-4 border-b border-white/20">
              <h4 className="font-bold text-lg mb-2">{bookingData.event.title}</h4>
              <p className="text-white/70 text-sm">
                {new Date(bookingData.event.event_date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Tickets */}
            <div className="space-y-3 mb-4">
              {bookingData.selectedTickets.map((selectedTicket) => {
                const ticketType = bookingData.ticketTypes.find(
                  (t) => t.id === selectedTicket.ticketId
                );
                if (!ticketType) return null;
                return (
                  <div key={selectedTicket.ticketId} className="flex justify-between">
                    <div>
                      <p className="font-semibold">{ticketType.name}</p>
                      <p className="text-white/60 text-sm">Qty: {selectedTicket.quantity}</p>
                    </div>
                    <p className="font-bold text-[#00baff]">
                      ₹{(ticketType.price * selectedTicket.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#00baff]">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">Total</span>
                <span className="text-3xl font-bold text-[#00baff]">
                  ₹{bookingData.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black border border-white/20 rounded-xl p-5 sm:p-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-5 sm:mb-6">Complete Your Purchase</h2>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                    <User className="inline w-4 h-4 mr-2 text-[#00baff]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors text-base ${
                      errors.name ? 'border-red-500' : 'border-white/20 focus:border-[#00baff]'
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                    <Mail className="inline w-4 h-4 mr-2 text-[#00baff]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors text-base ${
                      errors.email ? 'border-red-500' : 'border-white/20 focus:border-[#00baff]'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  <p className="text-white/50 text-xs mt-1">
                    Your ticket will be sent to this email
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-white font-bold mb-2 text-sm sm:text-base">
                    <Phone className="inline w-4 h-4 mr-2 text-[#00baff]" />
                    Phone Number *
                  </label>
                  
                  <div className="space-y-3">
                    {/* Country Code Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country..."
                        className="w-full pl-10 pr-4 py-2 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors text-sm"
                      />
                    </div>

                    {/* Country Code Selector */}
                    <select
                      value={formData.countryCode}
                      onChange={(e) => {
                        setFormData({ ...formData, countryCode: e.target.value });
                        setCountrySearch('');
                      }}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                    >
                      {filteredCountryCodes.map((country, index) => (
                        <option key={`${country.code}-${index}`} value={country.code}>
                          {country.flag} {country.country} ({country.code})
                        </option>
                      ))}
                    </select>

                    {/* Phone Input */}
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="1234567890"
                      className={`w-full px-4 py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors text-base ${
                        errors.phone ? 'border-red-500' : 'border-white/20 focus:border-[#00baff]'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Payment Info */}
                <div className="bg-[#00baff]/10 border border-[#00baff]/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-[#00baff] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[#00baff] mb-1">Secure Payment</h4>
                      <p className="text-white/70 text-sm leading-relaxed">
                        You'll be redirected to PayU's secure payment gateway to complete your
                        purchase. Your payment information is never stored on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 sm:py-5 bg-[#00baff] text-black font-bold text-base sm:text-lg rounded-lg hover:bg-[#00d4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,186,255,0.5)] flex items-center justify-center gap-2 touch-manipulation"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Order Summary (Desktop Only) */}
          <div className="lg:col-span-1 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black border border-[#00baff] rounded-xl p-6 sticky top-24"
            >
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              {/* Event Info */}
              <div className="mb-6">
                <img
                  src={
                    bookingData.event.image_url ||
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
                  }
                  alt={bookingData.event.title}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-bold mb-1">{bookingData.event.title}</h4>
                <p className="text-white/60 text-sm">
                  {new Date(bookingData.event.event_date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Ticket Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                {bookingData.selectedTickets.map((selected) => {
                  const ticket = bookingData.ticketTypes.find((t) => t.id === selected.ticketId);
                  if (!ticket) return null;
                  return (
                    <div key={selected.ticketId} className="flex justify-between text-sm">
                      <span className="text-white/70">
                        {ticket.name} x {selected.quantity}
                      </span>
                      <span className="font-bold">
                        ₹{(ticket.price * selected.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-[#00baff]">
                  ₹{bookingData.totalAmount.toFixed(2)}
                </span>
              </div>

              <p className="text-white/50 text-xs text-center">
                By completing this purchase, you agree to our Terms & Conditions
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicket;

