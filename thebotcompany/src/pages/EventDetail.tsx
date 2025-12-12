import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Ticket, Info, Navigation, Phone } from 'lucide-react';
import { supabase, Event, TicketType } from '../lib/supabase';
import TermsAndConditions from '../components/TermsAndConditions';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({});

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);

      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch ticket types
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('ticket_types')
        .select('*')
        .eq('event_id', id)
        .order('price', { ascending: true });

      if (ticketsError) throw ticketsError;
      setTicketTypes(ticketsData || []);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketChange = (ticketId: string, quantity: number, maxAllowed: number) => {
    if (quantity < 0 || quantity > maxAllowed) return;
    
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const getTotalAmount = () => {
    return Object.entries(selectedTickets).reduce((total, [ticketId, quantity]) => {
      const ticket = ticketTypes.find((t) => t.id === ticketId);
      return total + (ticket?.price || 0) * quantity;
    }, 0);
  };

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0);
  };

  const handleProceedToCheckout = () => {
    const selectedItems = Object.entries(selectedTickets)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticketId, quantity]) => ({ ticketId, quantity }));

    if (selectedItems.length === 0) {
      alert('Please select at least one ticket');
      return;
    }

    // Navigate to booking page with selection
    navigate(`/events/${id}/book`, {
      state: {
        event,
        selectedTickets: selectedItems,
        ticketTypes,
        totalAmount: getTotalAmount(),
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event not found</h2>
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

  // Function to generate Google Maps URL
  const getGoogleMapsUrl = (location: string, venueName?: string) => {
    const query = venueName ? `${venueName}, ${location}` : location;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8 font-['Josefin_Sans']">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-white/70 hover:text-[#00baff] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </motion.button>

        {/* Ticket Selection - Mobile First (Show at top on mobile) */}
        <div className="lg:hidden mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border-2 border-[#00baff] rounded-xl p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Ticket className="w-6 h-6 text-[#00baff]" />
              <h2 className="text-2xl font-bold">Select Tickets</h2>
            </div>

            <div className="space-y-4 mb-6">
              {ticketTypes.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-black border border-white/20 rounded-lg p-4 hover:border-[#00baff] transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{ticket.name}</h3>
                      {ticket.description && (
                        <p className="text-white/60 text-sm mt-1">{ticket.description}</p>
                      )}
                      <p className="text-white/50 text-xs mt-2">
                        {ticket.available_quantity} available
                      </p>
                    </div>
                    <span className="text-[#00baff] font-bold text-2xl ml-3">
                      ₹{ticket.price}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() =>
                        handleTicketChange(
                          ticket.id,
                          (selectedTickets[ticket.id] || 0) - 1,
                          Math.min(ticket.available_quantity, ticket.max_per_order)
                        )
                      }
                      disabled={!selectedTickets[ticket.id] || selectedTickets[ticket.id] === 0}
                      className="w-12 h-12 bg-black border-2 border-white/20 rounded-lg hover:border-[#00baff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-2xl">
                      {selectedTickets[ticket.id] || 0}
                    </span>
                    <button
                      onClick={() =>
                        handleTicketChange(
                          ticket.id,
                          (selectedTickets[ticket.id] || 0) + 1,
                          Math.min(ticket.available_quantity, ticket.max_per_order)
                        )
                      }
                      disabled={
                        (selectedTickets[ticket.id] || 0) >=
                        Math.min(ticket.available_quantity, ticket.max_per_order)
                      }
                      className="w-12 h-12 bg-black border-2 border-white/20 rounded-lg hover:border-[#00baff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            {getTotalTickets() > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#00baff]/10 border border-[#00baff] rounded-lg p-5 mb-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/70 text-lg">Total Tickets:</span>
                  <span className="font-bold text-xl">{getTotalTickets()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-lg">Total Amount:</span>
                  <span className="text-3xl font-bold text-[#00baff]">
                    ₹{getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={getTotalTickets() === 0}
              className="w-full py-4 bg-[#00baff] text-black font-bold text-lg rounded-lg hover:bg-[#00d4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,186,255,0.5)]"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image - Responsive for all aspect ratios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full rounded-xl overflow-hidden bg-black"
            >
              <img
                src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
                alt={event.title}
                className="w-full h-auto max-h-[600px] object-contain lg:object-cover lg:h-96"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 md:p-8 w-full">
                <span className="px-3 py-1 bg-[#00baff] text-black text-xs md:text-sm font-bold rounded-full mb-2 md:mb-4 inline-block">
                  {event.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  {event.title}
                </h1>
              </div>
            </motion.div>

            {/* Event Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-black border border-white/20 rounded-xl p-5">
                <Calendar className="w-7 h-7 text-[#00baff] mb-3" />
                <h3 className="font-bold mb-1 text-base">Date</h3>
                <p className="text-white/70 text-sm">
                  {new Date(event.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="bg-black border border-white/20 rounded-xl p-5">
                <Clock className="w-7 h-7 text-[#00baff] mb-3" />
                <h3 className="font-bold mb-1 text-base">Time</h3>
                <p className="text-white/70 text-sm">
                  {new Date(event.event_date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-black border border-white/20 rounded-xl p-5">
                <MapPin className="w-7 h-7 text-[#00baff] mb-3" />
                <h3 className="font-bold mb-1 text-base">Location</h3>
                <p className="text-white/70 text-sm">{event.location}</p>
                {event.venue_name && (
                  <p className="text-white/50 text-xs mt-1">{event.venue_name}</p>
                )}
                <a
                  href={getGoogleMapsUrl(event.location, event.venue_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-[#00baff] text-black text-sm font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
              </div>

              <div className="bg-black border border-white/20 rounded-xl p-5">
                <Users className="w-7 h-7 text-[#00baff] mb-3" />
                <h3 className="font-bold mb-1 text-base">Organized By</h3>
                <p className="text-white/70 text-sm">{event.organizer}</p>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black border border-white/20 rounded-xl p-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-6 h-6 text-[#00baff]" />
                <h2 className="text-2xl font-bold">About This Event</h2>
              </div>
              <p className="text-white/70 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-black border border-[#00baff]/50 rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Phone className="w-6 h-6 text-[#00baff]" />
                <h3 className="text-xl font-bold">Need Help?</h3>
              </div>
              <div className="space-y-3 text-white/80">
                <p>For any queries or assistance regarding this event, contact us:</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+919025439428"
                    className="flex items-center gap-3 px-4 py-3 bg-black border border-white/20 rounded-lg hover:border-[#00baff] transition-colors"
                  >
                    <Phone className="w-5 h-5 text-[#00baff]" />
                    <div>
                      <p className="text-sm text-white/60">Call us at</p>
                      <p className="font-semibold">+91 90254 39428</p>
                    </div>
                  </a>
                  <a
                    href="mailto:thebot26@gmail.com"
                    className="flex items-center gap-3 px-4 py-3 bg-black border border-white/20 rounded-lg hover:border-[#00baff] transition-colors"
                  >
                    <Info className="w-5 h-5 text-[#00baff]" />
                    <div>
                      <p className="text-sm text-white/60">Email us at</p>
                      <p className="font-semibold">thebot26@gmail.com</p>
                    </div>
                  </a>
                </div>
                <p className="text-xs text-white/50 mt-3">
                  Available: Monday - Saturday, 9:00 AM - 6:00 PM IST
                </p>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TermsAndConditions customTerms={event.terms_and_conditions} />
            </motion.div>
          </div>

          {/* Right Column - Ticket Selection (Desktop Only) */}
          <div className="lg:col-span-1 hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black border-2 border-[#00baff] rounded-xl p-6"
            >
              <div className="flex items-center gap-2 mb-6">
                <Ticket className="w-6 h-6 text-[#00baff]" />
                <h2 className="text-2xl font-bold">Select Tickets</h2>
              </div>

              <div className="space-y-4 mb-6">
                {ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="bg-black border border-white/20 rounded-lg p-5 hover:border-[#00baff] transition-colors"
                  >
                    <div className="flex flex-col gap-3 mb-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl">{ticket.name}</h3>
                        <span className="text-[#00baff] font-bold text-2xl">
                          ₹{ticket.price}
                        </span>
                      </div>
                      {ticket.description && (
                        <p className="text-white/60 text-sm">{ticket.description}</p>
                      )}
                      <p className="text-white/50 text-xs">
                        {ticket.available_quantity} available
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() =>
                          handleTicketChange(
                            ticket.id,
                            (selectedTickets[ticket.id] || 0) - 1,
                            Math.min(ticket.available_quantity, ticket.max_per_order)
                          )
                        }
                        disabled={!selectedTickets[ticket.id] || selectedTickets[ticket.id] === 0}
                        className="w-10 h-10 bg-black border-2 border-white/20 rounded-lg hover:border-[#00baff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl font-bold"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-bold text-2xl">
                        {selectedTickets[ticket.id] || 0}
                      </span>
                      <button
                        onClick={() =>
                          handleTicketChange(
                            ticket.id,
                            (selectedTickets[ticket.id] || 0) + 1,
                            Math.min(ticket.available_quantity, ticket.max_per_order)
                          )
                        }
                        disabled={
                          (selectedTickets[ticket.id] || 0) >=
                          Math.min(ticket.available_quantity, ticket.max_per_order)
                        }
                        className="w-10 h-10 bg-black border-2 border-white/20 rounded-lg hover:border-[#00baff] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            {/* Total - Mobile */}
            {getTotalTickets() > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#00baff]/10 border-2 border-[#00baff] rounded-lg p-5 mb-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-lg">Total Tickets:</span>
                  <span className="font-bold text-2xl">{getTotalTickets()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70 text-lg">Total Amount:</span>
                  <span className="text-3xl font-bold text-[#00baff]">
                    ₹{getTotalAmount().toFixed(2)}
                  </span>
                </div>
              </motion.div>
            )}

            <button
              onClick={handleProceedToCheckout}
              disabled={getTotalTickets() === 0}
              className="w-full py-5 bg-[#00baff] text-black font-bold text-xl rounded-lg hover:bg-[#00d4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-[0_0_30px_rgba(0,186,255,0.5)]"
            >
              Proceed to Checkout
            </button>
          </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;

