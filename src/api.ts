const CURRENCY_CONVERTER_API_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1";
export const AVAILABLE_CURRENCIES_API = `${CURRENCY_CONVERTER_API_BASE}/currencies.json`;
export const CURRENCY_CONVERTER_API = `${CURRENCY_CONVERTER_API_BASE}/currencies`;

export type CurrencyDataRecord = Record<string, string>;

export interface ConversionRates {
  [key: string]: number;
}

export interface CurrencyApiResponse {
  date: string;
  [baseCurrency: string]: ConversionRates | string;
}

export async function fetchData<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error);
    throw new Error(`Failed to fetch data from ${url}`);
  }
}

export async function getAvailableCurrencies(): Promise<CurrencyDataRecord> {
    return fetchData<CurrencyDataRecord>(AVAILABLE_CURRENCIES_API);
}

export async function getConversionRate(sourceCurrency: string, targetCurrency: string): Promise<number> {
    const url = `${CURRENCY_CONVERTER_API}/${sourceCurrency.toLowerCase()}.json`;
    const response = await fetchData<CurrencyApiResponse>(url);
    const conversionRates = response[sourceCurrency.toLowerCase()] as ConversionRates;
    const rate = conversionRates[targetCurrency.toLowerCase()];

    if (rate === undefined) {
        throw new Error(`Could not find conversion rate from ${sourceCurrency.toUpperCase()} to ${targetCurrency.toUpperCase()}`);
    }
    return rate;
}
