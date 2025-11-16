import { motion, AnimatePresence } from 'framer-motion';
import { Suspense, lazy, useState, useEffect } from 'react';
import { methodologyTimelineData } from './ui/methodology-timeline-data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Lazy load heavy 3D component
const GalaxyPlanets3D = lazy(() => import('./ui/galaxy-planets-3d'));

// Placeholder for RevealOnScroll from 21st.dev
const RevealOnScroll = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const Methodology = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const steps = [
    { title: 'Listen.', description: 'Map needs.' },
    { title: 'Design.', description: 'Wireframe workflows.' },
    { title: 'Automate.', description: 'Infuse AI.' },
    { title: 'Build.', description: 'Ship fast and scalable.' },
    { title: 'Evolve.', description: 'Grow with feedback.' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-advance carousel on mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % steps.length);
    }, 4000); // Change slide every 4 seconds
    
    return () => clearInterval(interval);
  }, [isMobile, steps.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % steps.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 bg-black relative z-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4 sm:mb-6"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            How we build bots that{' '}
            <span className="text-[#00baff] pixel-font font-heading font-bold">actually work.</span>
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#00baff] to-transparent mx-auto"></div>
        </motion.div>

        {/* Mobile Carousel - Beautiful carousel for mobile only */}
        {isMobile && (
          <div className="md:hidden mt-8 relative">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-black to-[#001a2e]/30 border border-[#00baff]/20 p-6 min-h-[320px] flex items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full flex flex-col items-center justify-center"
                >
                  {/* Step Number Circle */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00baff] to-[#0099cc] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(0,186,255,0.6)] relative"
                  >
                    <span className="text-black font-bold text-2xl z-10">{currentSlide + 1}</span>
                    <div className="absolute inset-0 rounded-full bg-[#00baff]/20 animate-ping"></div>
                  </motion.div>

                  {/* Step Title */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="text-3xl font-bold text-white mb-3 text-center"
                  >
                    {steps[currentSlide].title}
                  </motion.h3>

                  {/* Step Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="text-white/70 text-base text-center max-w-[280px] leading-relaxed"
                  >
                    {steps[currentSlide].description}
                  </motion.p>

                  {/* Progress Indicator */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 flex gap-2"
                  >
                    {steps.map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          idx === currentSlide
                            ? 'w-8 bg-[#00baff]'
                            : 'w-1.5 bg-[#00baff]/30'
                        }`}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 backdrop-blur-md border border-[#00baff]/40 hover:border-[#00baff] hover:bg-[#00baff]/15 transition-all duration-300 touch-manipulation active:scale-95 z-10 shadow-lg"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-6 h-6 text-[#00baff]" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/80 backdrop-blur-md border border-[#00baff]/40 hover:border-[#00baff] hover:bg-[#00baff]/15 transition-all duration-300 touch-manipulation active:scale-95 z-10 shadow-lg"
                aria-label="Next step"
              >
                <ChevronRight className="w-6 h-6 text-[#00baff]" />
              </button>
            </div>
          </div>
        )}

        {/* Interactive Orbital Timeline - Visible on larger screens */}
        <div className="hidden md:block mt-12 lg:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                  Every project starts with a{' '}
                  <span className="text-[#00baff] pixel-font font-heading font-bold">question.</span>
                </h3>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                  We listen, design with intent, automate what matters, build fast, and keep evolving.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  It's not a pipeline — it's a{' '}
                  <span className="text-[#00baff] font-bold pixel-font font-heading">loop</span> that keeps learning with you.
                </p>
              </motion.div>
              
            </div>

            {/* Right side - 3D Galaxy with Planets */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="w-full">
                <Suspense fallback={<div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-black/20 rounded-lg" />}>
                  <GalaxyPlanets3D planetsData={methodologyTimelineData} />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
