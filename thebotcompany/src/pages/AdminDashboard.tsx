import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Ticket,
  DollarSign,
  Users,
  Plus,
  LogOut,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { supabase, Event, Booking } from '../lib/supabase';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'events' | 'bookings'>('events');

  useEffect(() => {
    // Check authentication
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, events(*), ticket_types(*)')
        .order('created_at', { ascending: false });

      setEvents(eventsData || []);
      setBookings(bookingsData || []);

      // Calculate stats
      const totalRevenue = (bookingsData || [])
        .filter((b) => b.payment_status === 'completed')
        .reduce((sum, b) => sum + parseFloat(b.total_amount.toString()), 0);

      const uniqueCustomers = new Set(
        (bookingsData || []).map((b) => b.customer_email)
      ).size;

      setStats({
        totalEvents: eventsData?.length || 0,
        totalBookings: bookingsData?.filter((b) => b.payment_status === 'completed')
          .length || 0,
        totalRevenue,
        totalCustomers: uniqueCustomers,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_name');
    navigate('/admin/login');
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase.from('events').delete().eq('id', eventId);
      if (error) throw error;
      
      fetchData();
      alert('Event deleted successfully');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-white/70 text-sm">ULA Event Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 text-[#00baff]" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalEvents}</h3>
            <p className="text-white/70 text-sm">Total Events</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Ticket className="w-8 h-8 text-[#00baff]" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalBookings}</h3>
            <p className="text-white/70 text-sm">Total Bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-[#00baff]" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">₹{stats.totalRevenue.toFixed(2)}</h3>
            <p className="text-white/70 text-sm">Total Revenue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-[#00baff]" />
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold mb-1">{stats.totalCustomers}</h3>
            <p className="text-white/70 text-sm">Unique Customers</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === 'events'
                ? 'bg-[#00baff] text-black'
                : 'bg-black border border-white/20 text-white/70 hover:border-[#00baff]'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-bold rounded-lg transition-all ${
              activeTab === 'bookings'
                ? 'bg-[#00baff] text-black'
                : 'bg-black border border-white/20 text-white/70 hover:border-[#00baff]'
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => navigate('/admin/terms')}
            className="px-6 py-3 font-bold rounded-lg bg-black border border-white/20 text-white/70 hover:border-[#00baff] transition-all"
          >
            Terms & Conditions
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Manage Events</h2>
              <button
                onClick={() => navigate('/admin/events/create')}
                className="flex items-center gap-2 px-4 py-2 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Event
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Event</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{event.title}</p>
                          <p className="text-white/60 text-sm">{event.category}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(event.event_date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-white/80">{event.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            event.status === 'active'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {event.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="p-2 bg-blue-500/20 text-blue-500 rounded hover:bg-blue-500/30 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/events/edit/${event.id}`)}
                            className="p-2 bg-yellow-500/20 text-yellow-500 rounded hover:bg-yellow-500/30 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-black border border-white/20 rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">
                      Booking Ref
                    </th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Event</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Quantity</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 text-white/70 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 20).map((booking) => (
                    <tr key={booking.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 font-mono text-sm text-[#00baff]">
                        {booking.booking_reference}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-semibold">{booking.customer_name}</p>
                          <p className="text-white/60 text-sm">{booking.customer_email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {booking.events?.title || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-white/80">{booking.quantity}</td>
                      <td className="py-3 px-4 font-bold text-[#00baff]">
                        ₹{parseFloat(booking.total_amount.toString()).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            booking.payment_status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : booking.payment_status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/20 text-red-500'
                          }`}
                        >
                          {booking.payment_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

