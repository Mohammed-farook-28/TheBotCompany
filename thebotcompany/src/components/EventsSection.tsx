import { motion } from 'framer-motion';
import { Calendar, Ticket, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Upcoming <span className="text-[#00baff]">Events</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover and book tickets for amazing experiences curated by ULA
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-black border border-white/20 rounded-xl p-8 hover:border-[#00baff] transition-all duration-300"
          >
            <Calendar className="w-12 h-12 text-[#00baff] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Curated Experiences</h3>
            <p className="text-white/70 mb-6">
              From conferences and workshops to exclusive tours and festivals - discover events
              that inspire and excite.
            </p>
            <ul className="space-y-2 text-white/60">
              <li>✓ Premium event selection</li>
              <li>✓ Verified organizers</li>
              <li>✓ Best-in-class venues</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-black border border-white/20 rounded-xl p-8 hover:border-[#00baff] transition-all duration-300"
          >
            <Ticket className="w-12 h-12 text-[#00baff] mb-4" />
            <h3 className="text-2xl font-bold mb-3">Seamless Booking</h3>
            <p className="text-white/70 mb-6">
              Book your tickets in minutes with our secure payment system and instant email
              confirmations.
            </p>
            <ul className="space-y-2 text-white/60">
              <li>✓ Secure payments via PayU</li>
              <li>✓ Instant ticket confirmation</li>
              <li>✓ Easy cancellation policy</li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/events')}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#00baff] text-black font-bold text-lg rounded-xl hover:bg-[#00d4ff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,186,255,0.5)]"
          >
            Browse All Events
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsSection;


