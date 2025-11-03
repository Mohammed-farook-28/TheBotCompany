import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import DecryptedText from './DecryptedText';

// Lazy load heavy 3D component
const TorusKnotParticles = lazy(() => import('./TorusKnotParticles'));

// Placeholder for MotionReveal from 21st.dev
const MotionReveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  return (
    <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-gradient-to-b from-black via-black to-[#001a2e]/50">
      <div className="max-w-7xl mx-auto">
        <MotionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight pixel-font font-heading">
                <DecryptedText
                  text="We build bots that think,"
                  speed={90}
                  maxIterations={15}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  className="text-white pixel-font font-heading font-bold"
                  encryptedClassName="text-[#00baff] pixel-font font-heading font-bold"
                  parentClassName="cursor-pointer pixel-font font-heading font-bold"
                />
            
                <DecryptedText
                  text="and systems that scale."
                  speed={90}
                  maxIterations={15}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  className="text-[#00baff] pixel-font font-heading font-bold"
                  encryptedClassName="text-white pixel-font font-heading font-bold"
                  parentClassName="cursor-pointer pixel-font font-heading font-bold"
                />
              </h2>
            </div>
            <div className="relative order-1 md:order-2" style={{ background: 'transparent', zIndex: 1 }}>
              <Suspense fallback={<div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]" />}>
                <TorusKnotParticles />
              </Suspense>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};

export default About;
