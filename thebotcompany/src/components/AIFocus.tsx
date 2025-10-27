import { motion } from 'framer-motion';
import { Features } from './ui/features-8';

const AIFocus = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black to-[#001a2e]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-white text-center mb-20"
        >
          AI is not an add-on.{' '}
          <span className="text-[#00baff]">It's our foundation.</span>
        </motion.h2>

        <Features />
      </div>
    </section>
  );
};

export default AIFocus;
