import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { methodologyTimelineData } from './ui/methodology-timeline-data';

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
  const steps = [
    { title: 'Listen.', description: 'Map needs.' },
    { title: 'Design.', description: 'Wireframe workflows.' },
    { title: 'Automate.', description: 'Infuse AI.' },
    { title: 'Build.', description: 'Ship fast and scalable.' },
    { title: 'Evolve.', description: 'Grow with feedback.' },
  ];

  return (
    <section className="py-8 md:py-12 px-6 bg-gradient-to-b from-[#001a2e]/80 via-[#001a2e]/30 to-black relative z-10">
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

        {/* Traditional Linear Steps - Hidden on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mt-12 sm:mt-16 md:hidden">
          {steps.map((step, index) => (
            <RevealOnScroll key={index} delay={index * 0.1}>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#00baff] to-transparent"></div>
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#00baff] flex items-center justify-center mb-6 mx-auto shadow-[0_0_30px_rgba(0,186,255,0.5)]">
                    <span className="text-black font-bold text-xl">{index + 1}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-center">{step.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

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
