import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Globe, Layout, Bot, Zap, Boxes, Smartphone, 
  Brain, Settings, BarChart3, 
  Code, Workflow, MessageSquare, FileText, 
  Users, Search, TrendingUp, Cpu, Lock
} from 'lucide-react';

const Services = () => {
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const updateScale = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScale(0.4);
      } else if (width < 1024) {
        setScale(0.7);
      } else {
        setScale(1);
      }
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

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

  // Generate responsive positions around the section
  const getFixedPosition = (index: number) => {
    const positions = [
      // Top row
      { x: -500 * scale, y: -150 * scale }, { x: -200 * scale, y: -300 * scale }, { x: 0, y: -250 * scale }, { x: 500 * scale, y: -180 * scale }, { x: 200 * scale, y: -150 * scale },
      // Left side
      { x: -360 * scale, y: -70 * scale }, { x: -380 * scale, y: 50 * scale }, { x: -550 * scale, y: 150 * scale },
      // Right side  
      { x: 450 * scale, y: -50 * scale }, { x: 280 * scale, y: 50 * scale }, { x: 550 * scale, y: 250 * scale },
      // Bottom row
      { x: -300 * scale, y: 150 * scale }, { x: -300 * scale, y: 280 * scale }, { x: 0, y: 100 * scale }, { x: 100 * scale, y: 180 * scale }, { x: 400 * scale, y: 150 * scale },
      // Additional positions
      { x: -150 * scale, y: -100 * scale }, { x: -750 * scale, y: -100 * scale }, { x: -150 * scale, y: 200 * scale }, { x: 350 * scale, y: 300 * scale }
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
    <section className="py-6 sm:py-8 md:py-12 px-4 sm:px-6 bg-gradient-to-b from-black via-black to-[#001a2e]/30 relative overflow-hidden z-10">
      <div className="max-w-7xl mx-auto">
        {/* Center Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center min-h-[200px] sm:min-h-[250px] md:min-h-[300px] lg:min-h-[350px] relative"
        >
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white text-center z-10 relative px-4"
          >
            Everything we build,{' '}
            <span className="text-[#00baff] pixel-font font-heading font-bold">thinks.</span>
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
                className="absolute flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/90 backdrop-blur-md border border-[#00baff]/40 rounded-full hover:border-[#00baff] hover:bg-[#00baff]/15 hover:shadow-[0_0_20px_rgba(0,186,255,0.3)] transition-all duration-300 cursor-pointer group"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: Math.abs(position.x) < 200 && Math.abs(position.y) < 200 ? 20 : 10, // Closer tabs appear above
                }}
              >
                <service.icon className="w-3 h-3 sm:w-4 sm:h-4 text-[#00baff] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-white group-hover:text-[#00baff] transition-colors duration-200 whitespace-nowrap">
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
