/**
 * Utility for handling international currency formatting and sub-unit conversion.
 *
 * Most currencies use 2 decimal places (cents), but some differ:
 * - JPY: 0 decimals (yen are whole units)
 * - KWD, BHD, OMR: 3 decimals (fils)
 *
 * This module provides a single source of truth for sub-unit conversion.
 */

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', locale: 'en-US' },
  { code: 'EUR', symbol: '€', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', locale: 'en-GB' },
  { code: 'CAD', symbol: '$', locale: 'en-CA' },
  { code: 'AUD', symbol: '$', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP' },
] as const;

/**
 * Number of decimal places for each currency's sub-unit.
 * Default is 2 (cents). Override here for non-standard currencies.
 */
const CURRENCY_SUBUNIT_DIGITS: Record<string, number> = {
  JPY: 0,
  KRW: 0,
  KWD: 3,
  BHD: 3,
  OMR: 3,
};

/**
 * Returns the multiplier to convert a major unit to its sub-unit.
 * e.g. USD → 100, JPY → 1, KWD → 1000
 */
export const getSubunitMultiplier = (currencyCode: string = 'USD'): number => {
  const digits = CURRENCY_SUBUNIT_DIGITS[currencyCode.toUpperCase()] ?? 2;
  return Math.pow(10, digits);
};

/**
 * Converts a float (from a UI input) to an integer sub-unit for database storage.
 * e.g. toSubUnits(45.50, 'USD') → 4550
 *      toSubUnits(1000, 'JPY')  → 1000
 */
export const toSubUnits = (amount: number, currencyCode: string = 'USD'): number => {
  return Math.round(amount * getSubunitMultiplier(currencyCode));
};

/**
 * Converts an integer sub-unit back to a float major unit for display.
 * e.g. fromSubUnits(4550, 'USD') → 45.50
 *      fromSubUnits(1000, 'JPY') → 1000
 */
export const fromSubUnits = (subUnits: number, currencyCode: string = 'USD'): number => {
  return subUnits / getSubunitMultiplier(currencyCode);
};

/**
 * Formats a numeric amount (in sub-units) to a localized currency string.
 */
export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode) || SUPPORTED_CURRENCIES[0];
  const majorUnit = fromSubUnits(amount, currencyCode);

  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
  }).format(majorUnit);
};

