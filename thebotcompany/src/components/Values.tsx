import { motion } from 'framer-motion';
import CurvedLoop from './ui/curved-loop';

const Values = () => {

  return (
    <section className="py-16 bg-black">
      {/* Full Width Curved Loop Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="w-full"
      >
        <CurvedLoop 
          marqueeText="Less talk ✦ More bots ✦ More value ✦"
          speed={2}
          curveAmount={600}
          direction="right"
          interactive={true}
          className="text-[#00baff] w-full"
        />
      </motion.div>
    </section>
  );
};

export default Values;
