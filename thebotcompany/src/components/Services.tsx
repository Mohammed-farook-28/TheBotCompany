import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Globe, Layout, Bot, Zap, Boxes, Smartphone, 
  Brain, Settings, BarChart3, 
  Code, Workflow, MessageSquare, FileText, 
  Users, Search, TrendingUp, Cpu, Lock
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Services = () => {
  const [scale, setScale] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width < 640) {
        setScale(0.4);
      } else if (width < 1024) {
        setScale(0.7);
      } else {
        setScale(1);
      }
    };
    
    updateScale();
    
    // Throttle resize handler for better performance
    let resizeTimeout: number | null = null;
    const throttledResize = () => {
      if (resizeTimeout) return;
      resizeTimeout = window.setTimeout(() => {
        updateScale();
        resizeTimeout = null;
      }, 150);
    };
    
    window.addEventListener('resize', throttledResize, { passive: true });
    return () => {
      window.removeEventListener('resize', throttledResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  const services = [
    { title: 'Websites', icon: Globe },
    { title: 'Web Apps', icon: Layout },
    { title: 'AI Agents', icon: Bot },
    { title: 'Custom GPT', icon: Brain },
    { title: 'CRM Systems', icon: Users },
    { title: 'Internal Tools', icon: Settings },
    { title: 'Automations', icon: Zap },
    { title: 'SaaS Tools', icon: Boxes },
    { title: 'Mobile Apps', icon: Smartphone },
    { title: 'Data Analytics', icon: BarChart3 },
    { title: 'API Development', icon: Code },
    { title: 'Workflow Design', icon: Workflow },
    { title: 'Chat Systems', icon: MessageSquare },
    { title: 'Documentation', icon: FileText },
    { title: 'Search Engines', icon: Search },
    { title: 'Growth Tools', icon: TrendingUp },
    { title: 'AI Processing', icon: Cpu },
    { title: 'Security Systems', icon: Lock },
  ];

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const totalSlides = Math.ceil(services.length / 3);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 3000); // Change slide every 3 seconds
    
    return () => clearInterval(interval);
  }, [isMobile, services.length]);

  // Generate responsive positions around the section
  const getFixedPosition = (index: number) => {
    const positions = [
      // Top row
      { x: -500 * scale, y: -150 * scale }, { x: -200 * scale, y: -200 * scale }, { x: 0, y: -250 * scale }, { x: 500 * scale, y: -180 * scale }, { x: 200 * scale, y: -150 * scale },
      // Left side
      { x: -360 * scale, y: -70 * scale }, { x: -380 * scale, y: 50 * scale }, { x: -550 * scale, y: 150 * scale },
      // Right side  
      { x: 450 * scale, y: -50 * scale }, { x: 280 * scale, y: 50 * scale }, { x: 550 * scale, y: 250 * scale },
      // Bottom row
      { x: -300 * scale, y: 150 * scale }, { x: -300 * scale, y: 280 * scale }, { x: 0, y: 100 * scale }, { x: 100 * scale, y: 180 * scale }, { x: 400 * scale, y: 150 * scale },
      // Additional positions
      { x: -150 * scale, y: -100 * scale }, { x: -750 * scale, y: -100 * scale }, { x: -150 * scale, y: 200 * scale }, { x: 350 * scale, y: 300 * scale }
    ];
    
    const position = positions[index] || { x: 0, y: 0 };
    return { 
      x: position.x, 
      y: position.y, 
      ring: Math.sqrt(position.x * position.x + position.y * position.y) 
    };
  };

  // Generate delays with 0.3 second intervals between services
  const getDelay = (index: number) => {
    return index * 0.3; // 0.3 seconds between each service
  };

  // Get services for current carousel slide (3 per slide)
  const getServicesForSlide = (slideIndex: number) => {
    const startIndex = slideIndex * 3;
    return services.slice(startIndex, startIndex + 3);
  };

  const totalSlides = Math.ceil(services.length / 3);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 bg-black relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Layout: Heading above, Carousel below */}
        {isMobile && (
          <>
            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-2xl sm:text-3xl font-bold text-white text-center px-4"
              >
                Everything we build,{' '}
                <span className="text-[#00baff] pixel-font font-heading font-bold">thinks.</span>
              </motion.h2>
            </motion.div>

            {/* Mobile Carousel - Shows 3 services at a time */}
            <div className="md:hidden w-full relative">
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="flex gap-4 justify-center items-center"
                  >
                    {getServicesForSlide(currentSlide).map((service, idx) => (
                      <motion.div
                        key={`${currentSlide}-${service.title}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.3 }}
                        className="flex flex-col items-center gap-2 px-4 py-3 bg-black/90 backdrop-blur-md border border-[#00baff]/40 rounded-lg hover:border-[#00baff] hover:bg-[#00baff]/15 transition-all duration-300 min-w-[100px] flex-1 max-w-[120px]"
                      >
                        <service.icon className="w-6 h-6 text-[#00baff]" />
                        <span className="text-xs font-medium text-white text-center">
                          {service.title}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Carousel Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-black/90 border border-[#00baff]/40 hover:border-[#00baff] hover:bg-[#00baff]/15 transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label="Previous services"
                >
                  <ChevronLeft className="w-5 h-5 text-[#00baff]" />
                </button>
                
                {/* Slide Indicators */}
                <div className="flex gap-2">
                  {Array.from({ length: totalSlides }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
                        idx === currentSlide
                          ? 'w-8 bg-[#00baff]'
                          : 'w-2 bg-[#00baff]/30'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-black/90 border border-[#00baff]/40 hover:border-[#00baff] hover:bg-[#00baff]/15 transition-all duration-300 touch-manipulation active:scale-95"
                  aria-label="Next services"
                >
                  <ChevronRight className="w-5 h-5 text-[#00baff]" />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Desktop Layout: Center Text with floating tabs */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[500px] relative overflow-hidden"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center z-10 relative px-4"
            >
              Everything we build,{' '}
              <span className="text-[#00baff] pixel-font font-heading font-bold">thinks.</span>
            </motion.h2>

            {/* Desktop Service Tabs positioned at equal intervals */}
            {services.map((service, index) => {
             const position = getFixedPosition(index);
             const delay = getDelay(index);
            
            return (
              <motion.div
                key={service.title}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: position.x,
                  y: position.y
                }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  x: position.x,
                  y: position.y
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: delay,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="absolute flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2 bg-black/90 backdrop-blur-md border border-[#00baff]/40 rounded-full hover:border-[#00baff] hover:bg-[#00baff]/15 hover:shadow-[0_0_20px_rgba(0,186,255,0.3)] active:scale-95 transition-all duration-300 cursor-pointer touch-manipulation group"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: Math.abs(position.x) < 200 && Math.abs(position.y) < 200 ? 20 : 10,
                  minWidth: '44px',
                  minHeight: '44px',
                }}
              >
                <service.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00baff] group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
                <span className="text-[11px] sm:text-xs md:text-sm font-medium text-white group-hover:text-[#00baff] transition-colors duration-200 whitespace-nowrap">
                  {service.title}
                </span>
              </motion.div>
            );
          })}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
