import { motion } from 'framer-motion';
import { Globe, Layout, Bot, Zap, Boxes, Smartphone } from 'lucide-react';

// Placeholder for BentoBox from 21st.dev
const BentoBox = ({ children }: { children: React.ReactNode }) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">{children}</div>;
};

const Services = () => {
  const services = [
    {
      icon: Globe,
      title: 'Websites',
      description: 'Fast, aesthetic, built to convert.',
    },
    {
      icon: Layout,
      title: 'Web Apps',
      description: 'Dashboards and portals that scale.',
    },
    {
      icon: Bot,
      title: 'AI Agents',
      description: 'From chatbots to copilots.',
    },
    {
      icon: Zap,
      title: 'Automations',
      description: 'n8n, API, and workflow magic.',
    },
    {
      icon: Boxes,
      title: 'SaaS Tools',
      description: 'We turn your idea into a product.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Apps',
      description: 'Built for Android, iOS, and everywhere else.',
    },
  ];

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-[#001a2e] to-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12 md:mb-20"
        >
          Everything we build,{' '}
          <span className="text-[#00baff]">thinks.</span>
        </motion.h2>

        <BentoBox>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 md:p-8 bg-black border border-white/10 rounded-2xl hover:border-[#00baff] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,186,255,0.4)] cursor-pointer"
            >
              <service.icon className="w-8 h-8 md:w-10 md:h-10 text-[#00baff] mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-white/60 text-sm md:text-base">{service.description}</p>
            </motion.div>
          ))}
        </BentoBox>
      </div>
    </section>
  );
};

export default Services;
