import { motion } from 'framer-motion';

interface LogoItem {
  src: string;
  alt: string;
  url?: string;
}

// BrandCarousel component with logo images - Infinite seamless loop
const BrandCarousel = ({ logos }: { logos: LogoItem[] }) => {
  // Duplicate logos multiple times for seamless infinite scroll
  // We need enough duplicates so the animation can loop seamlessly
  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];
  
  // Calculate the width needed for one complete set of logos
  // This will be used as the animation distance for seamless looping
  // Each logo container is approximately: 80px (mobile) to 128px (desktop) + 48px gap = ~128-176px average
  const singleSetWidth = 150 * logos.length; // Approximate width for one complete set

  return (
    <div className="flex gap-8 sm:gap-12 overflow-hidden relative w-full">
      <motion.div
        className="flex gap-12 items-center"
        animate={{ 
          x: [0, -singleSetWidth],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {duplicatedLogos.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="w-20 h-10 sm:w-24 sm:h-12 md:w-32 md:h-16 flex-shrink-0 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:drop-shadow-[0_0_15px_rgba(0,186,255,0.5)]"
          >
            {logo.url ? (
              <a
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex items-center justify-center"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-w-full max-h-full object-contain"
                />
              </a>
            ) : (
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const TrustedBy = () => {
  const logos: LogoItem[] = [
    {
      src: '/logos/rrt-logo.png',
      alt: 'Road Runner Tribe',
      url: 'https://roadrunnertribe.com/'
    },
    {
      src: '/logos/wynza-logo.png',
      alt: 'Wynza Corp',
      url: 'https://wynzacorp.com/'
    },
    {
      src: '/logos/inai-logo.png',
      alt: 'Inai Community',
      url: 'https://inaicommunity.com/'
    },
    {
      src: '/logos/Keenstack.png',
      alt: 'Keenstack Media',
      url: 'https://keenstackmedia.com/'
    },
    {
      src: '/logos/patasilks-log0.png',
      alt: 'Pata Silks',
      url: 'http://patasilks.com/'
    },
    {
      src: '/logos/stjamescourt-logo.png',
      alt: 'St James Court',
      url: 'https://stjamescourt.netlify.app/'
    },
    {
      src: '/logos/mathewarts.png',
      alt: 'Matthew Arts',
      url: 'https://matthewarts.in/'
    }
  ];

  return (
    <section className="py-6 sm:py-8 md:py-10 border-t border-white/10 bg-black relative z-10 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-white/60 text-center mb-8 sm:mb-12 text-xs sm:text-sm tracking-wide uppercase px-4"
        >
          Trusted by teams building the future.
        </motion.p>
        <BrandCarousel logos={logos} />
      </div>
    </section>
  );
};

export default TrustedBy;
