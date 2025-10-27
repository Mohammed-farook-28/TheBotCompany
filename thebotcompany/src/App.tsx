import { PromptingIsAllYouNeed } from '@/components/ui/animated-hero-section';
import PillNav from './components/PillNav';
import Logo from './components/Logo';
import TrustedBy from './components/TrustedBy';
import About from './components/About';
import AIFocus from './components/AIFocus';
import Methodology from './components/Methodology';
import Services from './components/Services';
import Values from './components/Values';
import ContactForm from './components/ContactForm';
import CTA from './components/CTA';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';

function App() {
  const navigationItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Optional cursor trail effect */}
      <CursorTrail />

      {/* Animated Hero Section with Pong Game */}
      <div id="home" className="relative h-screen">
        <PromptingIsAllYouNeed />
        
        {/* Navigation positioned in center of hero section */}
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
      </div>

      {/* Main sections */}
      <TrustedBy />
      <div id="about">
        <About />
      </div>
      <AIFocus />
      <Methodology />
      <div id="services">
        <Services />
      </div>
      <Values />
      <div id="contact">
        <ContactForm />
      </div>
      <CTA />
      <Footer />
    </div>
  );
}

export default App;
