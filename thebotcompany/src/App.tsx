import { Suspense, lazy, useEffect, useState } from 'react';
import PillNav from './components/PillNav';
import Logo from './components/Logo';

// Lazy load GlobalParticles - only load when needed
const GlobalParticles = lazy(() => import('./components/GlobalParticles'));

// Lazy load heavy components
const PromptingIsAllYouNeed = lazy(() => import('@/components/ui/animated-hero-section').then(module => ({ default: module.PromptingIsAllYouNeed })));
const TrustedBy = lazy(() => import('./components/TrustedBy'));
const About = lazy(() => import('./components/About'));
const AIFocus = lazy(() => import('./components/AIFocus'));
const Methodology = lazy(() => import('./components/Methodology'));
const Services = lazy(() => import('./components/Services'));
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
  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  // Lazy load GlobalParticles after initial render for better performance
  const [shouldLoadParticles, setShouldLoadParticles] = useState(false);

  // Scroll to top on every page load/refresh
  useEffect(() => {
    // Always start from the top, regardless of URL hash
    window.scrollTo(0, 0);
    
    // Load particles after a short delay to prioritize above-the-fold content
    const particlesTimer = setTimeout(() => {
      setShouldLoadParticles(true);
    }, 100);

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
      clearTimeout(particlesTimer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Global Particles - lazy loaded after initial render */}
      {shouldLoadParticles && (
        <Suspense fallback={null}>
          <GlobalParticles />
        </Suspense>
      )}
      
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
