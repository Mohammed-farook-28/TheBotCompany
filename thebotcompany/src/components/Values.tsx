import { motion } from 'framer-motion';

// Placeholder for NeonText from 21st.dev
const NeonText = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="relative inline-block group">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00baff] group-hover:w-full transition-all duration-300 shadow-[0_0_10px_rgba(0,186,255,0.8)]"></span>
    </span>
  );
};

const Values = () => {
  const values = [
    'Clarity first.',
    'Automation with empathy.',
    'Build what lasts.',
  ];

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white">
                <NeonText>{value}</NeonText>
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Values;
