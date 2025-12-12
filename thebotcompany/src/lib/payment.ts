import CryptoJS from 'crypto-js';

interface PayUPaymentParams {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash?: string;
}

export const generatePayUHash = (params: PayUPaymentParams): string => {
  const merchantKey = import.meta.env.VITE_PAYU_MERCHANT_KEY || '';
  const salt = import.meta.env.VITE_PAYU_SALT || '';

  // PayU hash generation format:
  // sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
  const hashString = `${merchantKey}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;
  
  const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
  return hash;
};

export const initiatePayUPayment = (
  bookingDetails: {
    bookingReference: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    eventTitle: string;
  }
) => {
  const merchantKey = import.meta.env.VITE_PAYU_MERCHANT_KEY || '';
  const payuUrl = import.meta.env.VITE_PAYU_URL || 'https://test.payu.in/_payment';
  const baseUrl = import.meta.env.VITE_BASE_URL || window.location.origin;

  const params: PayUPaymentParams = {
    txnid: bookingDetails.bookingReference,
    amount: bookingDetails.amount.toFixed(2),
    productinfo: bookingDetails.eventTitle,
    firstname: bookingDetails.customerName,
    email: bookingDetails.customerEmail,
    phone: bookingDetails.customerPhone,
    surl: `${baseUrl}/payment/success`,
    furl: `${baseUrl}/payment/failure`,
  };

  params.hash = generatePayUHash(params);

  // Create a form and submit it
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = payuUrl;

  // Add all parameters as hidden inputs
  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value || '';
    form.appendChild(input);
  });

  // Add merchant key
  const keyInput = document.createElement('input');
  keyInput.type = 'hidden';
  keyInput.name = 'key';
  keyInput.value = merchantKey;
  form.appendChild(keyInput);

  // Submit form
  document.body.appendChild(form);
  form.submit();
};

export const generateBookingReference = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ULA-${timestamp}-${randomStr}`;
};

export const validatePayUResponse = (
  response: Record<string, string>
): boolean => {
  const salt = import.meta.env.VITE_PAYU_SALT || '';
  
  // Reverse hash validation
  const hashString = `${salt}|${response.status}|||||||||||${response.email}|${response.firstname}|${response.productinfo}|${response.amount}|${response.txnid}|${response.key}`;
  
  const generatedHash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
  
  return generatedHash === response.hash;
};


