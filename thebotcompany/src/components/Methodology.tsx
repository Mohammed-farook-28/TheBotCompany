import { motion } from 'framer-motion';
import RadialOrbitalTimeline from './ui/radial-orbital-timeline';
import { methodologyTimelineData } from './ui/methodology-timeline-data';

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
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How we build bots that{' '}
            <span className="text-[#00baff]">actually work.</span>
          </h2>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#00baff] to-transparent mx-auto"></div>
        </motion.div>

        {/* Traditional Linear Steps - Hidden on larger screens */}
        <div className="grid md:grid-cols-5 gap-8 mt-20 md:hidden">
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
        <div className="hidden md:block mt-20">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-6"
              >
                <h3 className="text-3xl font-bold text-white leading-tight">
                  Every project starts with a{' '}
                  <span className="text-[#00baff]">question.</span>
                </h3>
                <p className="text-lg text-white/80 leading-relaxed">
                  We listen, design with intent, automate what matters, build fast, and keep evolving.
                </p>
                <p className="text-lg text-white/80 leading-relaxed">
                  It's not a pipeline — it's a{' '}
                  <span className="text-[#00baff] font-semibold">loop</span> that keeps learning with you.
                </p>
              </motion.div>
              
            </div>

            {/* Right side - Orbital Timeline */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="w-full h-[600px]">
                <RadialOrbitalTimeline timelineData={methodologyTimelineData} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
