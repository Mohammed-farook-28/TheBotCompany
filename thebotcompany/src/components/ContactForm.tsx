import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import Stepper, { Step } from './Stepper';
import RotatingText from './ui/rotating-text';
import { User, Mail, Phone, MessageSquare, Bot, Search } from 'lucide-react';

const FORM_STORAGE_KEY = 'contactFormData';
const STEP_STORAGE_KEY = 'contactFormStep';

const ContactForm = () => {
  // Load saved form data from sessionStorage on mount
  const loadSavedData = () => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  };

  const savedData = loadSavedData();
  
  const [formData, setFormData] = useState({
    name: savedData?.name || '',
    email: savedData?.email || '',
    countryCode: savedData?.countryCode || '+1',
    phone: savedData?.phone || '',
    timeline: savedData?.timeline || '',
    description: savedData?.description || ''
  });

  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(STEP_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 1;
    }
    return 1;
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shake, setShake] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Save form data to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Save current step to sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && currentStep) {
      sessionStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
    }
  }, [currentStep]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '';
      case 2:
        return formData.email.trim() !== '' && validateEmail(formData.email);
      case 3:
        return true; // Phone is optional
      case 4:
        return formData.description.trim() !== '';
      default:
        return true;
    }
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const handleNext = (step: number) => {
    if (!validateStep(step)) {
      triggerShake();
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Validate all required fields before submission
    if (!formData.name.trim() || !formData.email.trim() || !validateEmail(formData.email) || !formData.description.trim()) {
      triggerShake();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzf0e3Q3zmjPx4hf06dIM7_0Dxqy9ezaJLkoz7fFQckp_J-Kwk0wbML_rFnuy8zydw/exec';
      
      // Prepare data for Google Sheets
      const sheetData = {
        timestamp: new Date().toISOString(),                                                                  
        name: formData.name,
        email: formData.email,
        countryCode: formData.countryCode || '', // Country code in separate column
        phone: formData.phone || '', // Phone number without country code in separate column
        budget: 'Not specified', // Budget removed, but keep for backward compatibility with Google Sheets
        timeline: formData.timeline || 'Not specified',
        description: formData.description
      };
      
      // Send data to Google Sheets via Google Apps Script
      // Using URL-encoded form data to avoid CORS issues
      if (GOOGLE_SCRIPT_URL) {
        try {
          // Create URL-encoded form data
          const urlParams = new URLSearchParams();
          urlParams.append('timestamp', sheetData.timestamp);
          urlParams.append('name', sheetData.name);
          urlParams.append('email', sheetData.email);
          urlParams.append('countryCode', sheetData.countryCode);
          urlParams.append('phone', sheetData.phone);
          urlParams.append('budget', sheetData.budget);
          urlParams.append('timeline', sheetData.timeline);
          urlParams.append('description', sheetData.description);
          
          // Send using fetch with URL-encoded data
          // Note: mode: 'no-cors' prevents reading response, but avoids CORS errors
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Avoid CORS issues
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: urlParams.toString()
          });
          
          // Form data sent successfully
        } catch (fetchError) {
          // Error sending to Google Sheets - continue anyway, don't block user experience
          // Error is silently handled to maintain user experience
        }
      }

      // Send email notification to tharun@thebotcompany.in
      const EMAIL_API_URL = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/send-lead-notification';
      try {
        await fetch(EMAIL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            countryCode: formData.countryCode || '',
            phone: formData.phone || '',
            timeline: formData.timeline || 'Not specified',
            description: formData.description,
          }),
        });
        // Email notification sent (errors are silently handled to not block user experience)
      } catch (emailError) {
        // Error sending email - silently handled to maintain user experience
        console.log('Email notification error (non-blocking):', emailError);
      }
      
      // Clear saved form data after successful submission
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(FORM_STORAGE_KEY);
        sessionStorage.removeItem(STEP_STORAGE_KEY);
      }
      
      // Set submitted state
      setIsSubmitted(true);
      
      // Open Cal.com in a new tab after a short delay
      setTimeout(() => {
        window.open('https://cal.com/thebotcompany/meet-the-bot', '_blank', 'noopener,noreferrer');
      }, 2000);
      
    } catch (error) {
      // Error submitting form - still show success and open Cal.com even if Google Sheets fails
    setIsSubmitted(true);
      setTimeout(() => {
        window.open('https://cal.com/thebotcompany/meet-the-bot', '_blank', 'noopener,noreferrer');
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };


  const allCountryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+507', country: 'Panama', flag: '🇵🇦' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+53', country: 'Cuba', flag: '🇨🇺' },
    { code: '+509', country: 'Haiti', flag: '🇭🇹' },
    { code: '+1', country: 'Dominican Republic', flag: '🇩🇴' },
    { code: '+1', country: 'Jamaica', flag: '🇯🇲' },
    { code: '+1', country: 'Puerto Rico', flag: '🇵🇷' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+376', country: 'Andorra', flag: '🇦🇩' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+378', country: 'San Marino', flag: '🇸🇲' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+39', country: 'Vatican City', flag: '🇻🇦' },
    { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+213', country: 'Algeria', flag: '🇩🇿' },
    { code: '+376', country: 'Andorra', flag: '🇦🇩' },
    { code: '+244', country: 'Angola', flag: '🇦🇴' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+374', country: 'Armenia', flag: '🇦🇲' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+375', country: 'Belarus', flag: '🇧🇾' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+501', country: 'Belize', flag: '🇧🇿' },
    { code: '+229', country: 'Benin', flag: '🇧🇯' },
    { code: '+975', country: 'Bhutan', flag: '🇧🇹' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: '+267', country: 'Botswana', flag: '🇧🇼' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+673', country: 'Brunei', flag: '🇧🇳' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
    { code: '+257', country: 'Burundi', flag: '🇧🇮' },
    { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
    { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+238', country: 'Cape Verde', flag: '🇨🇻' },
    { code: '+236', country: 'Central African Republic', flag: '🇨🇫' },
    { code: '+235', country: 'Chad', flag: '🇹🇩' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+269', country: 'Comoros', flag: '🇰🇲' },
    { code: '+242', country: 'Congo', flag: '🇨🇬' },
    { code: '+243', country: 'DR Congo', flag: '🇨🇩' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+53', country: 'Cuba', flag: '🇨🇺' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
    { code: '+1', country: 'Dominica', flag: '🇩🇲' },
    { code: '+1', country: 'Dominican Republic', flag: '🇩🇴' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
    { code: '+291', country: 'Eritrea', flag: '🇪🇷' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+679', country: 'Fiji', flag: '🇫🇯' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+241', country: 'Gabon', flag: '🇬🇦' },
    { code: '+220', country: 'Gambia', flag: '🇬🇲' },
    { code: '+995', country: 'Georgia', flag: '🇬🇪' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+1', country: 'Grenada', flag: '🇬🇩' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+224', country: 'Guinea', flag: '🇬🇳' },
    { code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
    { code: '+592', country: 'Guyana', flag: '🇬🇾' },
    { code: '+509', country: 'Haiti', flag: '🇭🇹' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+354', country: 'Iceland', flag: '🇮🇸' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+1', country: 'Jamaica', flag: '🇯🇲' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+856', country: 'Laos', flag: '🇱🇦' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
    { code: '+231', country: 'Liberia', flag: '🇱🇷' },
    { code: '+218', country: 'Libya', flag: '🇱🇾' },
    { code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+853', country: 'Macau', flag: '🇲🇴' },
    { code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
    { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
    { code: '+265', country: 'Malawi', flag: '🇲🇼' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+960', country: 'Maldives', flag: '🇲🇻' },
    { code: '+223', country: 'Mali', flag: '🇲🇱' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+692', country: 'Marshall Islands', flag: '🇲🇭' },
    { code: '+222', country: 'Mauritania', flag: '🇲🇷' },
    { code: '+230', country: 'Mauritius', flag: '🇲🇺' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+691', country: 'Micronesia', flag: '🇫🇲' },
    { code: '+373', country: 'Moldova', flag: '🇲🇩' },
    { code: '+377', country: 'Monaco', flag: '🇲🇨' },
    { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+212', country: 'Morocco', flag: '🇲🇦' },
    { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
    { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
    { code: '+264', country: 'Namibia', flag: '🇳🇦' },
    { code: '+674', country: 'Nauru', flag: '🇳🇷' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+687', country: 'New Caledonia', flag: '🇳🇨' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
    { code: '+227', country: 'Niger', flag: '🇳🇪' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+680', country: 'Palau', flag: '🇵🇼' },
    { code: '+970', country: 'Palestine', flag: '🇵🇸' },
    { code: '+507', country: 'Panama', flag: '🇵🇦' },
    { code: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+1', country: 'Puerto Rico', flag: '🇵🇷' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
    { code: '+290', country: 'Saint Helena', flag: '🇸🇭' },
    { code: '+1', country: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { code: '+1', country: 'Saint Lucia', flag: '🇱🇨' },
    { code: '+378', country: 'San Marino', flag: '🇸🇲' },
    { code: '+239', country: 'São Tomé and Príncipe', flag: '🇸🇹' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+221', country: 'Senegal', flag: '🇸🇳' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+248', country: 'Seychelles', flag: '🇸🇨' },
    { code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+677', country: 'Solomon Islands', flag: '🇸🇧' },
    { code: '+252', country: 'Somalia', flag: '🇸🇴' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+211', country: 'South Sudan', flag: '🇸🇸' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+249', country: 'Sudan', flag: '🇸🇩' },
    { code: '+597', country: 'Suriname', flag: '🇸🇷' },
    { code: '+268', country: 'Swaziland', flag: '🇸🇿' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
    { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+228', country: 'Togo', flag: '🇹🇬' },
    { code: '+676', country: 'Tonga', flag: '🇹🇴' },
    { code: '+1', country: 'Trinidad and Tobago', flag: '🇹🇹' },
    { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+1', country: 'Turks and Caicos', flag: '🇹🇨' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
    { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
    { code: '+39', country: 'Vatican City', flag: '🇻🇦' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+681', country: 'Wallis and Futuna', flag: '🇼🇫' },
    { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  ];

  // Filter countries based on search
  const filteredCountryCodes = useMemo(() => {
    if (!countrySearch.trim()) return allCountryCodes;
    const searchLower = countrySearch.toLowerCase();
    return allCountryCodes.filter(
      (country) =>
        country.country.toLowerCase().includes(searchLower) ||
        country.code.includes(countrySearch)
    );
  }, [countrySearch]);

  const timelineOptions = [
    { value: 'asap', label: 'ASAP (Rush job)' },
    { value: '1-month', label: 'Within 1 month' },
    { value: '2-3-months', label: '2-3 months' },
    { value: '3-6-months', label: '3-6 months' },
    { value: 'flexible', label: 'Flexible timeline' }
  ];

  if (isSubmitted) {
    return (
      <section className="py-8 md:py-12 px-6 bg-black relative z-10">
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
            <p className="text-lg text-white/70 mb-6">
              {isSubmitting ? 'Submitting your information...' : 'Opening Cal.com in a new tab...'}
            </p>
            {!isSubmitting && (
              <a
                href="https://cal.com/thebotcompany/meet-the-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
              >
                Schedule Meeting Now →
              </a>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 px-4 md:px-6 bg-black relative z-10 overflow-x-visible">
      <div className="max-w-4xl mx-auto relative z-10 overflow-x-visible">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 px-4"
        >
          {savedData && savedData.name && savedData.name.trim() !== '' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-[#00baff]/10 border border-[#00baff]/30 rounded-lg text-sm text-[#00baff]"
            >
              ✓ Your progress has been saved. Continuing from where you left off...
            </motion.div>
          )}
          <div className="flex justify-center items-center overflow-visible w-full">
          <RotatingText 
            words={['idea', 'dream', 'app', 'vision']}
            interval={2000}
            baseText="Let's build your next"
            highlightColor="#00baff"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold !w-auto sm:ml-[2rem] md:ml-[2.5rem] lg:ml-[3rem]"
          />
          </div>
          
        </motion.div>

        <motion.div
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Stepper
            initialStep={currentStep}
            onStepChange={handleStepChange}
            onNext={handleNext}
            onFinalStepCompleted={handleSubmit}
            backButtonText="Previous"
            nextButtonText="Next"
            disableStepIndicators={true}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.name.trim() !== '') {
                    e.preventDefault();
                    // Trigger next step
                    const nextButton = document.querySelector('[data-stepper-next]') as HTMLButtonElement;
                    if (nextButton) nextButton.click();
                  }
                }}
                placeholder="Your full name"
                className="w-full px-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors text-base"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && formData.email.trim() !== '' && validateEmail(formData.email)) {
                    e.preventDefault();
                    // Trigger next step
                    const nextButton = document.querySelector('[data-stepper-next]') as HTMLButtonElement;
                    if (nextButton) nextButton.click();
                  }
                }}
                placeholder="your@email.com"
                className={`w-full px-4 py-3.5 sm:py-3 bg-black border rounded-lg text-white placeholder-white/50 focus:outline-none transition-colors text-base ${
                  formData.email.trim() !== '' && !validateEmail(formData.email)
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-white/20 focus:border-[#00baff]'
                }`}
                required
              />
              {formData.email.trim() !== '' && !validateEmail(formData.email) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
              )}
            </div>
          </Step>

          {/* Step 3: Phone with Country Code */}
          <Step>
            <div className="text-center">
              <Phone className="w-10 h-10 md:w-12 md:h-12 text-[#00baff] mx-auto mb-4 md:mb-6" />
              <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">What's your phone number?</h3>
              <p className="text-white/70 mb-6 md:mb-8 text-sm md:text-base">Optional, but helpful for quick communication</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white font-bold mb-2">Country Code</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full pl-10 pr-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors mb-2 text-base"
                  />
                </div>
                <select
                  value={formData.countryCode}
                  onChange={(e) => {
                    handleInputChange('countryCode', e.target.value);
                    setCountrySearch(''); // Clear search box after selection
                  }}
                  className="w-full px-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors text-base"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {filteredCountryCodes.map((country, index) => (
                    <option key={`${country.code}-${index}`} value={country.code}>
                      {country.flag} {country.country} ({country.code})
                    </option>
                  ))}
                </select>
                {filteredCountryCodes.length === 0 && (
                  <p className="text-red-500 text-sm mt-2">No countries found</p>
                )}
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="123 456 7890"
                className="w-full px-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors text-base"
              />
              </div>
            </div>
          </Step>

          {/* Step 4: Project Description */}
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
                  rows={5}
                  className="w-full px-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-[#00baff] focus:outline-none transition-colors resize-none text-base"
                  required
                />
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">Timeline</label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full px-4 py-3.5 sm:py-3 bg-black border border-white/20 rounded-lg text-white focus:border-[#00baff] focus:outline-none transition-colors text-base"
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
          </Step>
          </Stepper>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
