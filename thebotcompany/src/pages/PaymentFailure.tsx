import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Payment was unsuccessful';

  return (
    <div className="min-h-screen bg-black text-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black border border-red-500 rounded-xl p-8 md:p-12 text-center"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6"
          >
            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Payment Failed
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg mb-8"
          >
            {errorMessage}
          </motion.p>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8"
          >
            <h3 className="font-bold text-red-500 mb-2">What happened?</h3>
            <p className="text-white/70 text-sm">
              Your payment could not be processed. This might be due to:
            </p>
            <ul className="text-white/60 text-sm mt-3 space-y-1 list-disc list-inside">
              <li>Insufficient funds</li>
              <li>Payment gateway timeout</li>
              <li>Incorrect payment details</li>
              <li>Bank declined the transaction</li>
            </ul>
          </motion.div>

          {/* What to do next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-black border border-white/20 rounded-lg p-6 mb-8 text-left"
          >
            <h3 className="font-bold text-lg mb-3">What should I do?</h3>
            <ul className="text-white/70 text-sm space-y-2">
              <li>✓ Check your bank account balance</li>
              <li>✓ Verify your card details are correct</li>
              <li>✓ Try a different payment method</li>
              <li>✓ Contact your bank if the issue persists</li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#00baff] text-black font-bold rounded-lg hover:bg-[#00d4ff] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate('/events')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-black border border-white/20 text-white font-bold rounded-lg hover:border-[#00baff] transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Events
            </button>
          </motion.div>

          {/* Support */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/50 text-sm mt-8"
          >
            Need help?{' '}
            <a
              href="mailto:thebot26@gmail.com"
              className="text-[#00baff] hover:underline"
            >
              Contact Support
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentFailure;


