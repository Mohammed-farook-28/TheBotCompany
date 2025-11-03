import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';
import TorusKnotParticles from './TorusKnotParticles';

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
    <section className="py-8 md:py-12 px-4 md:px-6 bg-gradient-to-b from-black via-black to-[#001a2e]/50">
      <div className="max-w-7xl mx-auto">
        <MotionReveal>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight pixel-font font-heading">
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
            <div className="relative" style={{ background: 'transparent', zIndex: 1 }}>
              <TorusKnotParticles />
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};

export default About;
