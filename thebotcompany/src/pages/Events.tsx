import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Search, Filter } from 'lucide-react';
import { supabase, Event } from '../lib/supabase';
import { Link } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('events')
        .select('*')
        .eq('status', 'active')
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true });

      const { data, error } = await query;

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'conference', 'experience', 'workshop', 'tour', 'festival'];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 font-['Josefin_Sans']">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-4">
            Upcoming <span className="text-[#00baff]">Events</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/70 px-4">
            Discover amazing experiences curated by ULA
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap px-2">
            <Filter className="w-5 h-5 text-white/70 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all touch-manipulation ${
                  categoryFilter === category
                    ? 'bg-[#00baff] text-black'
                    : 'bg-black border border-white/20 text-white/70 hover:border-[#00baff]'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Ticket className="w-20 h-20 text-white/30 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white/70 mb-2">No events found</h3>
            <p className="text-white/50">
              {searchTerm || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Check back soon for upcoming events!'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/events/${event.id}`} className="touch-manipulation">
                  <div className="group bg-black border border-white/20 rounded-xl overflow-hidden hover:border-[#00baff] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,186,255,0.3)] h-full flex flex-col">
                    {/* Event Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden">
                      <img
                        src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-[#00baff] text-black text-xs font-bold rounded-full">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-hover:text-[#00baff] transition-colors leading-tight">
                        {event.title}
                      </h3>
                      
                      <p className="text-white/70 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 flex-1">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-white/80">
                          <Calendar className="w-4 h-4 text-[#00baff] flex-shrink-0" />
                          <span className="text-sm">
                            {new Date(event.event_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                          <MapPin className="w-4 h-4 text-[#00baff] flex-shrink-0" />
                          <span className="text-sm line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <button className="w-full py-3 sm:py-3.5 bg-[#00baff] text-black font-bold text-base sm:text-lg rounded-lg hover:bg-[#00d4ff] transition-colors group-hover:shadow-[0_0_20px_rgba(0,186,255,0.5)] touch-manipulation">
                        Book Now
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

