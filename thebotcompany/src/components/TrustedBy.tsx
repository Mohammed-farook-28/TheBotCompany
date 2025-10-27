import { motion } from 'framer-motion';

// Placeholder for BrandCarousel from 21st.dev
const BrandCarousel = ({ logos }: { logos: string[] }) => {
  return (
    <div className="flex gap-12 overflow-hidden">
      <motion.div
        className="flex gap-12 items-center"
        animate={{ x: [0, -1000] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...logos, ...logos].map((logo, i) => (
          <div
            key={i}
            className="w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(0,186,255,0.5)]"
          >
            <span className="text-white/60 hover:text-white text-sm font-bold">
              {logo}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TrustedBy = () => {
  const placeholderLogos = ['ACME Corp', 'TechStart', 'FutureAI', 'DataFlow', 'CloudSync', 'AutomateX'];

  return (
    <section className="py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white/60 text-center mb-12 text-sm tracking-wide uppercase"
        >
          Trusted by teams building the future.
        </motion.p>
        <BrandCarousel logos={placeholderLogos} />
      </div>
    </section>
  );
};

export default TrustedBy;
