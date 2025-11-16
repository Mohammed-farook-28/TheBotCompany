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
    <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <MotionReveal>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 items-center">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight pixel-font font-heading">
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
          </div>
        </MotionReveal>
      </div>
    </section>
  );
};

export default About;
