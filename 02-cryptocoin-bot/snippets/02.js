const ARG_CRYPTO_CURRENCY = 'CryptoCurrency';
const ARG_CURRENCY = 'Currency';

const cryptoCurrency = assistant.parameters[ARG_CRYPTO_CURRENCY];
const currency = assistant.parameters[ARG_CURRENCY] || 'usd';

const msg = `Getting current price for ${cryptoCurrency} in ${
  currency
} via Firebase`;
