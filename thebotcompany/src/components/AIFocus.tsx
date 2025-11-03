import { motion } from 'framer-motion';
import { Features } from './ui/features-8';

const AIFocus = () => {
  return (
    <section className="py-8 md:py-12 px-6 bg-gradient-to-b from-[#001a2e]/50 via-[#001a2e] to-[#001a2e]/80 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white text-center mb-8"
        >
          AI is not an add-on.{' '}
          <span className="text-[#00baff]">It's our foundation.</span>
        </motion.h2>

        <div className="relative z-10">
          <Features />
        </div>
      </div>
    </section>
  );
};

export default AIFocus;
