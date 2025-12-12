import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import BookTicket from './pages/BookTicket';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminEventForm from './pages/AdminEventForm';
import AdminTerms from './pages/AdminTerms';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<App />} />
        
        {/* Event Pages */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/book" element={<BookTicket />} />
        
        {/* Payment Pages */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        
        {/* Admin Pages */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/events/create" element={<AdminEventForm />} />
        <Route path="/admin/events/edit/:id" element={<AdminEventForm />} />
        <Route path="/admin/terms" element={<AdminTerms />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

