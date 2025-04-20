export function initPCIFields() {
  return new Promise((resolve, reject) => {
    const secureFields = new SecureFields();
    const merchantId = import.meta.env.VITE_PCI_MERCHANT_ID;

    secureFields.initTokenize(merchantId, {
      cardNumber: {
        placeholderElementId: 'card-number',
        inputType: 'tel'
      },
      cvv: {
        placeholderElementId: 'cvv-number',
        inputType: 'tel'
      }
    });
    
    secureFields.on('ready', () => {
      // Set styles manually as they're inside an iframe and out of the scope of the parent's stylesheets
      secureFields.setStyle('cardNumber', 'font: 16px/18px system-ui, sans-serif; border-radius: 0; border:0; -webkit-appearance: none; padding: 0; outline: none');
      secureFields.setStyle('cvv', 'font: 16px/18px system-ui, sans-serif; border-radius: 0; border:0; -webkit-appearance: none; padding: 0; outline: none');
      secureFields.focus('cardNumber');
      secureFields.setPlaceholder("cardNumber", "4242 4242 4242 4242");
      secureFields.setPlaceholder("cvv", "123");
      resolve(secureFields);
    });

    secureFields.on('error', reject);
  });
}

export async function handlePayment(secureFields, analytics) {
  try {
    debugger;
    analytics.track('Payment Attempt Started');

    // Get form values
    const cardholderName = document.getElementById('cardholder-name').value.trim();
    const expiryValue = document.getElementById('expiry').value;
    
    if (!cardholderName || !expiryValue) {
      throw new Error('Please fill all required fields');
    }

    // Convert expiration date
    const expiry = getExpirationDateObject(expiryValue);
    
    // Submit payment
    const result = await new Promise((resolve, reject) => {
      secureFields.submit({
        cardholderName: cardholderName,
        expm: parseInt(expiry.expm),
        expy: parseInt(expiry.expy),
        usage: 'SIMPLE'
      });

      secureFields.on('success', (data) => {
        resolve(data);
        analytics.track('Payment Success', {
          transactionId: data.transactionId
        });
      });

      secureFields.on('error', (error) => {
        reject(error);
        analytics.track('Payment Error', {
          error: error.message
        });
      });
    });

    return result;

  } catch (error) {
    analytics.track('Payment Error', {
      error: error.name,
      message: error.message
    });
    throw error;
  }
}