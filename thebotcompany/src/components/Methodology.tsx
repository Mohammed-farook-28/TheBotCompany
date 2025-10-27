import { motion } from 'framer-motion';

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

        <div className="grid md:grid-cols-5 gap-8 mt-20">
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
      </div>
    </section>
  );
};

export default Methodology;
