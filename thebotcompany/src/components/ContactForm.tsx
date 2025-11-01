import { useState } from 'react';
import { motion } from 'framer-motion';
import Stepper, { Step } from './Stepper';
import RotatingText from './ui/rotating-text';
import { User, Mail, Phone, MessageSquare, Bot, Zap, Globe } from 'lucide-react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    requirements: '',
    experience: '',
    goals: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCompanyField, setShowCompanyField] = useState(false);
  const [shake, setShake] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.email.trim() !== '' && formData.email.includes('@');
      case 3:
        return true; // Phone is optional
      case 4:
        return true; // Personal/Business selection is always valid
      case 5:
        return formData.projectType !== '';
      case 6:
        return formData.description.trim() !== '';
      default:
        return true;
    }
  };

  const handleStepChange = () => {
    // Step change handler - can be used for analytics or other side effects
  };

  const handleNext = (step: number) => {
    if (!validateStep(step)) {
      triggerShake();
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    // Validate all required fields before submission
    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      triggerShake();
      return;
    }
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    // Here you would typically send the data to your backend
  };

  const projectTypes = [
    { value: 'website', label: 'Website Development', icon: Globe },
    { value: 'webapp', label: 'Web Application', icon: Globe },
    { value: 'ai-agent', label: 'AI Agent/Bot', icon: Bot },
    { value: 'automation', label: 'Business Automation', icon: Zap },
    { value: 'saas', label: 'SaaS Platform', icon: Bot },
    { value: 'mobile', label: 'Mobile App', icon: Globe }
  ];

  const budgetRanges = [
    { value: 'under-5k', label: 'Under $5,000' },
    { value: '5k-15k', label: '$5,000 - $15,000' },
    { value: '15k-50k', label: '$15,000 - $50,000' },
    { value: '50k-plus', label: '$50,000+' },
    { value: 'discuss', label: 'Let\'s discuss' }
  ];

  const timelineOptions = [
    { value: 'asap', label: 'ASAP (Rush job)' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ];

  if (isSubmitted) {
    return (
      <section className="py-32 px-6 bg-gradient-to-b from-black to-[#001a2e]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-black border border-[#00baff] rounded-2xl p-12"
          >
            <div className="w-16 h-16 bg-[#00baff] rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Thanks for reaching out!
            </h2>
            <p className="text-xl text-white/70 mb-6">
              We've received your project details and will get back to you within 24 hours.
            </p>
            <p className="text-lg text-[#00baff]">
              Let's build something amazing together! 🚀
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-black to-[#001a2e] relative z-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <RotatingText 
            words={['idea', 'dream', 'app', 'vision']}
            interval={2000}
            baseText="Let's build your next"
            highlightColor="#00baff"
            className="text-center text-3xl md:text-4xl lg:text-5xl font-bold"
          />
          <p className="text-lg md:text-xl text-white/70">
            Tell us about your idea and we'll make it happen
          </p>
        </motion.div>

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          <Stepper
            initialStep={1}
            onStepChange={handleStepChange}
            onNext={handleNext}
            onFinalStepCompleted={handleSubmit}
            backButtonText="Previous"
            nextButtonText="Next"
          >
          {/* Step 1: Name only */}
          <Step>
            <div className="text-center">
              <User className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What's your name?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Let's start with the basics</p>
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                required
              />
            </div>
          </Step>

          {/* Step 2: Email only */}
          <Step>
            <div className="text-center">
              <Mail className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What's your email?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">We'll use this to get back to you</p>
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                required
              />
            </div>
          </Step>

          {/* Step 3: Phone only */}
          <Step>
            <div className="text-center">
              <Phone className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What's your phone number?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Optional, but helpful for quick communication</p>
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
              />
            </div>
          </Step>

          {/* Step 4: Organization/Company or Personal */}
          <Step>
            <div className="text-center">
              <User className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Personal or Business?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Are you representing a company or organization?</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-white font-bold mb-2">Project Type</label>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowCompanyField(false)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all text-sm md:text-base ${
                      !showCompanyField
                        ? 'border-[#00baff] bg-[#00baff]/10 text-[#00baff]'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    Personal Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCompanyField(true)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all text-sm md:text-base ${
                      showCompanyField
                        ? 'border-[#00baff] bg-[#00baff]/10 text-[#00baff]'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    Company/Organization
                  </button>
                </div>
              </div>
              
              {showCompanyField && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-white font-bold mb-2">Company/Organization Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Your company name"
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors"
                  />
                </motion.div>
              )}
            </div>
          </Step>

          {/* Step 5: What do you need */}
          <Step>
            <div className="text-center">
              <Bot className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What do you need?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Choose the type of project you're looking for</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projectTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleInputChange('projectType', type.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    formData.projectType === type.value
                      ? 'border-[#00baff] bg-[#00baff]/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <type.icon className="w-5 h-5 text-[#00baff] mx-auto mb-2" />
                  <div className="text-white font-bold text-sm leading-tight">{type.label}</div>
                </button>
              ))}
            </div>
          </Step>

          {/* Step 6: All details */}
          <Step>
            <div className="text-center">
              <MessageSquare className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Tell us more about your project</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Help us understand your vision better</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Project Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your project in detail. What do you want to build?"
                  rows={3}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors resize-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-bold mb-2">Budget Range</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                  >
                    <option value="">Select budget range</option>
                    {budgetRanges.map((range) => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Technical Requirements</label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  placeholder="Any specific technologies, integrations, or technical requirements..."
                  rows={2}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors resize-none"
                />
              </div>
              
              <div>
                <label className="block text-white font-bold mb-2">Project Goals</label>
                <textarea
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What do you hope to achieve with this project? Any specific business goals or outcomes?"
                  rows={2}
                  className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </Step>
          </Stepper>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
