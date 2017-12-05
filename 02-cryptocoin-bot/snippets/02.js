const ARG_CRYPTO_CURRENCY = 'CryptoCurrency';
const ARG_CURRENCY = 'Currency';

let cryptoCurrency = assistant.getArgument(ARG_CRYPTO_CURRENCY);
let currency = assistant.getArgument(ARG_CURRENCY) || 'USD';

const msg = `Getting current price for ${cryptoCurrency} in ${
  currency
} via Firebase`;
