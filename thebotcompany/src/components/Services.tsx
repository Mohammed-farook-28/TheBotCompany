import { motion } from 'framer-motion';
import { 
  Globe, Layout, Bot, Zap, Boxes, Smartphone, 
  Brain, Settings, BarChart3, 
  Code, Workflow, MessageSquare, FileText, 
  Users, Search, TrendingUp, Cpu, Lock
} from 'lucide-react';

const Services = () => {
  const services = [
    { title: 'Websites', icon: Globe },
    { title: 'Web Apps', icon: Layout },
    { title: 'AI Agents', icon: Bot },
    { title: 'Custom GPT', icon: Brain },
    { title: 'CRM Systems', icon: Users },
    { title: 'Internal Tools', icon: Settings },
    { title: 'Automations', icon: Zap },
    { title: 'SaaS Tools', icon: Boxes },
    { title: 'Mobile Apps', icon: Smartphone },
    { title: 'Data Analytics', icon: BarChart3 },
    { title: 'API Development', icon: Code },
    { title: 'Workflow Design', icon: Workflow },
    { title: 'Chat Systems', icon: MessageSquare },
    { title: 'Documentation', icon: FileText },
    { title: 'Search Engines', icon: Search },
    { title: 'Growth Tools', icon: TrendingUp },
    { title: 'AI Processing', icon: Cpu },
    { title: 'Security Systems', icon: Lock },
  ];

  // Generate fixed positions around the section
  const getFixedPosition = (index: number) => {
    // Predefined positions around the section to avoid overlaps
    const positions = [
      // Top row
      { x: -500, y: -150 }, { x: -200, y: -300 }, { x: 0, y: -250 }, { x: 500, y: -180 }, { x: 200, y: -150 },
      // Left side
      { x: -360, y: -70 }, { x: -380, y: 50 }, { x: -550, y: 150 },
      // Right side  
      { x: 450, y: -50 }, { x: 280, y: 50 }, { x: 550, y: 250 },
      // Bottom row
      { x: -300, y: 150 }, { x: -300, y: 280 }, { x: 0, y: 100 }, { x: 100, y: 180 }, { x: 400, y: 150 },
      // Additional positions
      { x: -150, y: -100 }, { x: -750, y: -100 }, { x: -150, y: 200 }, { x: 350, y: 300 }
    ];
    
    const position = positions[index] || { x: 0, y: 0 };
    return { 
      x: position.x, 
      y: position.y, 
      ring: Math.sqrt(position.x * position.x + position.y * position.y) 
    };
  };

  // Generate random delays for staggered appearance
  const getRandomDelay = () => {
    return 0.3 + (Math.random() * 1.5); // Random delay between 0.3s and 1.8s
  };

  return (
    <section className="py-8 md:py-12 px-4 md:px-6 bg-gradient-to-b from-black via-black to-[#001a2e]/30 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Center Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center min-h-[250px] md:min-h-[300px] relative"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center z-10 relative"
          >
            Everything we build,{' '}
            <span className="text-[#00baff]">thinks.</span>
          </motion.h2>

          {/* Service Tabs positioned at equal intervals */}
          {services.map((service, index) => {
            const position = getFixedPosition(index);
            const delay = getRandomDelay();
            
            return (
              <motion.div
                key={service.title}
                initial={{ 
                  opacity: 0, 
                  scale: 0,
                  x: position.x,
                  y: position.y
                }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1,
                  x: position.x,
                  y: position.y
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: delay,
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scale: 1.15,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="absolute flex items-center gap-2 px-3 py-2 bg-black/90 backdrop-blur-md border border-[#00baff]/40 rounded-full hover:border-[#00baff] hover:bg-[#00baff]/15 hover:shadow-[0_0_20px_rgba(0,186,255,0.3)] transition-all duration-300 cursor-pointer group"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: Math.abs(position.x) < 200 && Math.abs(position.y) < 200 ? 20 : 10, // Closer tabs appear above
                }}
              >
                <service.icon className="w-4 h-4 text-[#00baff] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-xs md:text-sm font-medium text-white group-hover:text-[#00baff] transition-colors duration-200 whitespace-nowrap">
                  {service.title}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
