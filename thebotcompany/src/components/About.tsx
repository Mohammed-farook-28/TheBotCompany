import { motion } from 'framer-motion';
import DecryptedText from './DecryptedText';

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
    <section className="py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <MotionReveal>
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                <DecryptedText
                  text="We build bots that think."
                  speed={100}
                  maxIterations={25}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  className="text-white"
                  encryptedClassName="text-[#00baff]"
                  parentClassName="cursor-pointer"
                />
            
                <DecryptedText
                  text="And systems that scale."
                  speed={100}
                  maxIterations={25}
                  animateOn="view"
                  revealDirection="start"
                  sequential={true}
                  className="text-[#00baff]"
                  encryptedClassName="text-white"
                  parentClassName="cursor-pointer"
                />
              </h2>
            </div>
            <div>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed">
                TheBotCompany turns complex ideas into living systems.
                From websites to AI agents, we make technology that works — and learns.
              </p>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};

export default About;
