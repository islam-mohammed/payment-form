import { initializeAnalytics } from './assets/js/analytics.js';
import { initPCIFields, handlePayment } from './assets/js/pci-proxy.js';

document.addEventListener('DOMContentLoaded', async () => {
  let analytics;
  let secureFields;

  try {
    // Initialize analytics
    analytics = await initializeAnalytics();
    
    // Track page view
    analytics.page('Payment', 'Inline Payment Page');

    // Initialize PCI Proxy
    secureFields = await initPCIFields();


    if(secureFields) {
      let paymentContainer = document.getElementById('payment-container');
      let cardContainer = document.getElementById('card-number-container');
      let cvvContainer = document.getElementById('cvv-container');
      let expiryInput = document.getElementById('expiry');
          
      // Set focus to input fields when clicking containers
      cardContainer.addEventListener('click', function () {
        secureFields.focus('cardNumber');
      });
      cvvContainer.addEventListener('click', function () {
        secureFields.focus('cvv');
      });

      secureFields.on('change', function (data) {
        // Fill expiration date date on card autocomplete
        if (data.event.type === 'autocomplete') {
          if (data.event.field === 'expiryYear') {
            var value = (expiryInput.value || '/')
            expiryInput.value = value.split('/')[0].trim() + ' / ' + data.event.value.slice(-2)
            return
          }

          if (data.event.field === 'expiryMonth') {
            var value = (expiryInput.value || '/')
            expiryInput.value = data.event.value + ' / ' + value.split('/')[1].trim()
            return
          }
        }

        // Set class names when fields change
        var cardImage = cardContainer.querySelector('.secure-field--card-icon__recognized-card');
        paymentContainer.classList.remove('secure-field__has-focus-cvv');
        paymentContainer.classList.remove('secure-field__has-focus-cardNumber');
        paymentContainer.classList.remove('field__has-error');
        cardContainer.classList.remove('secure-field__has-error');
        cvvContainer.classList.remove('secure-field__has-error');

        paymentContainer.classList.add(`secure-field__has-focus-${data.event.field}`);

        if (!data.fields.cardNumber.paymentMethod) {
          cardImage.src = 'src/assets/img/card-empty.svg';
          cardContainer.classList.remove('secure-field__is-recognized');
        } else {
          cardImage.src = 'src/assets/img/brands/' + data.fields.cardNumber.paymentMethod + '.svg';
          cardContainer.classList.add('secure-field__is-recognized');
        }
        if (data.event.type === 'keyUp' && data.event.field === 'cardNumber' && data.event.eventData && data.event.eventData.isNumber && data.fields.cardNumber.valid) {
          document.getElementById('expiry').focus();
        }
      })

      // Set class names on validate
      secureFields.on('validate', function (data) {
        paymentContainer.classList.remove('field__has-error');

        if (data.fields.cardNumber.valid) {
          cardContainer.classList.remove('secure-field__has-error');
        } else {
          cardContainer.classList.remove('secure-field__is-recognized');
          cardContainer.classList.add('secure-field__has-error');
          paymentContainer.classList.add('field__has-error');
          analytics.track('Card Number Error', {
            error: 'Card number is invalid'
          });
        }

        if (data.fields.cvv.valid) {
          cvvContainer.classList.remove('secure-field__has-error');
        } else {
          cvvContainer.classList.add('secure-field__has-error');
          paymentContainer.classList.add('field__has-error');
          analytics.track('CVV Error', {
            error: 'CVV is invalid'
          });
        }
      });

       // Setup form submission
       document.getElementById('form-submit').addEventListener('click', async () => {
        try {
          const result = await handlePayment(secureFields, analytics);
          document.getElementById('form-result').textContent = 
            `Payment successful! Transaction ID: ${result.transactionId}`;
        } catch (error) {
          document.getElementById('form-result').textContent = 
            `Error: ${error.message}`;
        }
      });

      secureFields.on('success', function (data) {
        if (data.transactionId) {
          var result = document.getElementById('form-result');
          result.innerText = 'Data submitted successfully (transactionId: ' + data.transactionId + ')';
          result.style.display = 'block';
        }
      });

      handleExpirationDate(document.getElementById("expiry"), "cvv", secureFields);
    }

  } catch (error) {
    console.error('Initialization error:', error);
    if (analytics) {
      analytics.track('Initialization Error', {
        error: error.message
      });
    }
  }

  document.getElementById('expiry').addEventListener('keydown', function (event) {
    if (this.value.length == 2 && event.key !== 'Backspace') {
      this.value = this.value + ' / ';
    }
  });

});