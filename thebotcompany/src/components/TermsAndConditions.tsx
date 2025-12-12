import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { supabase, TermsCondition } from '../lib/supabase';

interface TermsAndConditionsProps {
  customTerms?: string;
}

const TermsAndConditions = ({ customTerms }: TermsAndConditionsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [terms, setTerms] = useState<TermsCondition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch default terms if no custom terms provided
    if (!customTerms) {
      fetchTerms();
    } else {
      setLoading(false);
    }
  }, [customTerms]);

  const fetchTerms = async () => {
    try {
      const { data, error } = await supabase
        .from('terms_conditions')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTerms(data || []);
    } catch (error) {
      console.error('Error fetching terms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 bg-black border border-white/20 rounded-lg hover:border-[#00baff] transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00baff]" />
          <span className="font-semibold text-lg">Terms & Conditions</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white/70" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/70" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-6 bg-black border border-white/10 border-t-0 rounded-b-lg space-y-4 text-white/80 font-['Josefin_Sans']">
              <h3 className="font-bold text-lg text-white">Event Booking Terms & Conditions</h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-[#00baff] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : customTerms ? (
                <div className="space-y-3 text-sm leading-relaxed">
                  <p className="whitespace-pre-line">{customTerms}</p>
                </div>
              ) : terms.length > 0 ? (
                <div className="space-y-3 text-sm leading-relaxed">
                  {terms.map((term, index) => (
                    <div key={term.id}>
                      <h4 className="font-semibold text-white mb-1">
                        {index + 1}. {term.title}
                      </h4>
                      <p className="whitespace-pre-line">{term.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-center py-4">
                  No terms and conditions available at the moment.
                </p>
              )}

              <div className="pt-4 border-t border-white/10 text-xs text-white/60">
                <p>
                  By completing your booking, you acknowledge that you have read, understood, and
                  agree to these Terms & Conditions. Last updated: December 2025
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TermsAndConditions;

