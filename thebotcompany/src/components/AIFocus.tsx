import { motion } from 'framer-motion';
import { Features } from './ui/features-8';

const AIFocus = () => {
  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 bg-black relative z-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10">
          <Features />
        </div>
      </div>
    </section>
  );
};

export default AIFocus;
