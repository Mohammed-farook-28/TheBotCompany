import { Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PillNav from './components/PillNav';
import Logo from './components/Logo';


// Lazy load heavy components
const PromptingIsAllYouNeed = lazy(() => import('@/components/ui/animated-hero-section').then(module => ({ default: module.PromptingIsAllYouNeed })));
const TrustedBy = lazy(() => import('./components/TrustedBy'));
const About = lazy(() => import('./components/About'));
const AIFocus = lazy(() => import('./components/AIFocus'));
const Methodology = lazy(() => import('./components/Methodology'));
const Services = lazy(() => import('./components/Services'));
const EventsSection = lazy(() => import('./components/EventsSection'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const CTA = lazy(() => import('./components/CTA'));
const Footer = lazy(() => import('./components/Footer'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-2 border-[#00baff] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const navigate = useNavigate();
  
  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Events', href: '/events', isRoute: true },
    { label: 'Contact', href: '#contact' }
  ];

  // Scroll to top on every page load/refresh
  useEffect(() => {
    // Always start from the top, regardless of URL hash
    window.scrollTo(0, 0);

    // Also ensure scroll position is reset after a brief delay
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    // Handle browser back/forward navigation
    const handlePopState = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Navigation - Fixed outside hero section to remain visible */}
      <PillNav
        logo={<Logo />}
        items={navigationItems}
        activeHref="#home"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#FFFFFF"
        hoveredPillTextColor="#FFFFFF"
        pillTextColor="#000000"
        onMobileMenuClick={() => {}}
        onItemClick={(item) => {
          if (item.isRoute) {
            navigate(item.href);
          }
        }}
      />
      
      {/* Animated Hero Section with Pong Game */}
      <div id="home" className="relative h-screen z-10">
        <Suspense fallback={<LoadingSpinner />}>
          <PromptingIsAllYouNeed />
        </Suspense>
      </div>

      {/* Main sections */}
      <div className="relative z-10">
        <Suspense fallback={<div className="h-32 bg-black" />}>
          <TrustedBy />
        </Suspense>
        <div id="about">
          <Suspense fallback={<div className="h-96 bg-black" />}>
            <About />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-64 bg-black" />}>
          <AIFocus />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-black" />}>
          <Methodology />
        </Suspense>
        <div id="services">
          <Suspense fallback={<div className="h-96 bg-black" />}>
            <Services />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-64 bg-black" />}>
          <EventsSection />
        </Suspense>
        <div id="contact">
          <Suspense fallback={<div className="h-96 bg-black" />}>
            <ContactForm />
          </Suspense>
        </div>
        <Suspense fallback={<div className="h-32 bg-black" />}>
          <CTA />
        </Suspense>
        <Suspense fallback={<div className="h-32 bg-black" />}>
          <Footer />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
