import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Placeholder for AnimatedButton from React Bits
const AnimatedButton = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#00baff] text-black font-bold text-base sm:text-lg rounded-full overflow-hidden cursor-pointer"
    >
      <motion.span
        className="absolute inset-0 bg-white"
        initial={{ x: '-100%' }}
        whileHover={{ x: 0 }}
        transition={{ duration: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        animate={{ boxShadow: ['0 0 20px rgba(0,186,255,0.5)', '0 0 40px rgba(0,186,255,0.8)', '0 0 20px rgba(0,186,255,0.5)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.a>
  );
};

const CTA = () => {
  return (
    <section className="py-8 md:py-12 px-6 bg-gradient-to-b from-[#001a2e] via-[#001a2e]/70 to-black relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 px-4"
        >
          Ready to build your{' '}
          <span className="text-[#00baff] pixel-font font-heading font-bold">next bot?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-12 px-4"
        >
          Let's automate the boring and build the bold.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <AnimatedButton href="https://cal.com/thebotcompany/meet-the-bot">Schedule a Call</AnimatedButton>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
