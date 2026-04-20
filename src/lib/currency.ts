/**
 * Utility for handling international currency formatting and units on the frontend.
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'CAD', symbol: '$', locale: 'en-CA' },
  { code: 'AUD', symbol: '$', locale: 'en-AU' },
];

/**
 * Formats a numeric amount (in sub-units, e.g., cents) to a localized string.
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(amount / 100); // Assumes storage in cents
};

/**
 * Converts a float (from a UI input) to an Integer for database storage.
 */
export const toSubUnits = (amount: number): number => Math.round(amount * 100);
