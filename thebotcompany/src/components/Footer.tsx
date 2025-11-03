import { motion } from 'framer-motion';
import { Linkedin, Instagram } from 'lucide-react';

// Placeholder for FooterGlow effect from 21st.dev
const FooterGlow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#00baff] to-transparent"></div>
      {children}
    </div>
  );
};

const Footer = () => {
  const socials = [
    { icon: Linkedin, href: 'https://www.linkedin.com/in/the-bot-company-89667a395/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/thebotcompany.in/?utm_source=ig_web_button_share_sheet', label: 'Instagram' },
  ];

  return (
    <FooterGlow>
      <footer className="bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 items-center text-center md:text-left">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/60"
            >
              © 2025 TheBotCompany
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/60 text-center"
            >
              Built by TheBotCompany <br></br>
              X
              <br></br>
              Powered by Medistation - Canada 
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex gap-6 justify-center md:justify-end"
            >
              {socials.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-white/60 hover:text-[#00baff] transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(0,186,255,0.8)]"
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </footer>
    </FooterGlow>
  );
};

export default Footer;
