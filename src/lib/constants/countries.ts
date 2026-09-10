export interface Country {
  name: string;
  code: string; // Dial code e.g. "+1"
  flag: string; // Emoji flag e.g. "🇨🇦"
  isoCode: string; // e.g. "CA"
  currency: string; // e.g. "CAD", "GBP", "EUR", "USD", "SEK", "NOK"
  currencySymbol: string; // e.g. "$", "£", "€", "kr"
}

export const SUPPORTED_COUNTRIES: Country[] = [
  // Primary North America
  { name: "Canada", code: "+1", flag: "🇨🇦", isoCode: "CA", currency: "CAD", currencySymbol: "$" },
  { name: "United States", code: "+1", flag: "🇺🇸", isoCode: "US", currency: "USD", currencySymbol: "$" },

  // All European Nations
  { name: "Albania", code: "+355", flag: "🇦🇱", isoCode: "AL", currency: "ALL", currencySymbol: "L" },
  { name: "Andorra", code: "+376", flag: "🇦🇩", isoCode: "AD", currency: "EUR", currencySymbol: "€" },
  { name: "Austria", code: "+43", flag: "🇦🇹", isoCode: "AT", currency: "EUR", currencySymbol: "€" },
  { name: "Belarus", code: "+375", flag: "🇧🇾", isoCode: "BY", currency: "BYN", currencySymbol: "Br" },
  { name: "Belgium", code: "+32", flag: "🇧🇪", isoCode: "BE", currency: "EUR", currencySymbol: "€" },
  { name: "Bosnia and Herzegovina", code: "+387", flag: "🇧🇦", isoCode: "BA", currency: "BAM", currencySymbol: "KM" },
  { name: "Bulgaria", code: "+359", flag: "🇧🇬", isoCode: "BG", currency: "BGN", currencySymbol: "лв" },
  { name: "Croatia", code: "+385", flag: "🇭🇷", isoCode: "HR", currency: "EUR", currencySymbol: "€" },
  { name: "Cyprus", code: "+357", flag: "🇨🇾", isoCode: "CY", currency: "EUR", currencySymbol: "€" },
  { name: "Czech Republic", code: "+420", flag: "🇨🇿", isoCode: "CZ", currency: "CZK", currencySymbol: "Kč" },
  { name: "Denmark", code: "+45", flag: "🇩🇰", isoCode: "DK", currency: "DKK", currencySymbol: "kr" },
  { name: "Estonia", code: "+372", flag: "🇪🇪", isoCode: "EE", currency: "EUR", currencySymbol: "€" },
  { name: "Finland", code: "+358", flag: "🇫🇮", isoCode: "FI", currency: "EUR", currencySymbol: "€" },
  { name: "France", code: "+33", flag: "🇫🇷", isoCode: "FR", currency: "EUR", currencySymbol: "€" },
  { name: "Germany", code: "+49", flag: "🇩🇪", isoCode: "DE", currency: "EUR", currencySymbol: "€" },
  { name: "Greece", code: "+30", flag: "🇬🇷", isoCode: "GR", currency: "EUR", currencySymbol: "€" },
  { name: "Hungary", code: "+36", flag: "🇭🇺", isoCode: "HU", currency: "HUF", currencySymbol: "Ft" },
  { name: "Iceland", code: "+354", flag: "🇮🇸", isoCode: "IS", currency: "ISK", currencySymbol: "kr" },
  { name: "Ireland", code: "+353", flag: "🇮🇪", isoCode: "IE", currency: "EUR", currencySymbol: "€" },
  { name: "Italy", code: "+39", flag: "🇮🇹", isoCode: "IT", currency: "EUR", currencySymbol: "€" },
  { name: "Kosovo", code: "+383", flag: "🇽🇰", isoCode: "XK", currency: "EUR", currencySymbol: "€" },
  { name: "Latvia", code: "+371", flag: "🇱🇻", isoCode: "LV", currency: "EUR", currencySymbol: "€" },
  { name: "Liechtenstein", code: "+423", flag: "🇱🇮", isoCode: "LI", currency: "CHF", currencySymbol: "CHF" },
  { name: "Lithuania", code: "+370", flag: "🇱🇹", isoCode: "LT", currency: "EUR", currencySymbol: "€" },
  { name: "Luxembourg", code: "+352", flag: "🇱🇺", isoCode: "LU", currency: "EUR", currencySymbol: "€" },
  { name: "Malta", code: "+356", flag: "🇲🇹", isoCode: "MT", currency: "EUR", currencySymbol: "€" },
  { name: "Moldova", code: "+373", flag: "🇲🇩", isoCode: "MD", currency: "MDL", currencySymbol: "L" },
  { name: "Monaco", code: "+377", flag: "🇲🇨", isoCode: "MC", currency: "EUR", currencySymbol: "€" },
  { name: "Montenegro", code: "+382", flag: "🇲🇪", isoCode: "ME", currency: "EUR", currencySymbol: "€" },
  { name: "Netherlands", code: "+31", flag: "🇳🇱", isoCode: "NL", currency: "EUR", currencySymbol: "€" },
  { name: "North Macedonia", code: "+389", flag: "🇲🇰", isoCode: "MK", currency: "MKD", currencySymbol: "den" },
  { name: "Norway", code: "+47", flag: "🇳🇴", isoCode: "NO", currency: "NOK", currencySymbol: "kr" },
  { name: "Poland", code: "+48", flag: "🇵🇱", isoCode: "PL", currency: "PLN", currencySymbol: "zł" },
  { name: "Portugal", code: "+351", flag: "🇵🇹", isoCode: "PT", currency: "EUR", currencySymbol: "€" },
  { name: "Romania", code: "+40", flag: "🇷🇴", isoCode: "RO", currency: "RON", currencySymbol: "lei" },
  { name: "San Marino", code: "+378", flag: "🇸🇲", isoCode: "SM", currency: "EUR", currencySymbol: "€" },
  { name: "Serbia", code: "+381", flag: "🇷🇸", isoCode: "RS", currency: "RSD", currencySymbol: "din" },
  { name: "Slovakia", code: "+421", flag: "🇸🇰", isoCode: "SK", currency: "EUR", currencySymbol: "€" },
  { name: "Slovenia", code: "+386", flag: "🇸🇮", isoCode: "SI", currency: "EUR", currencySymbol: "€" },
  { name: "Spain", code: "+34", flag: "🇪🇸", isoCode: "ES", currency: "EUR", currencySymbol: "€" },
  { name: "Sweden", code: "+46", flag: "🇸🇪", isoCode: "SE", currency: "SEK", currencySymbol: "kr" },
  { name: "Switzerland", code: "+41", flag: "🇨🇭", isoCode: "CH", currency: "CHF", currencySymbol: "CHF" },
  { name: "Ukraine", code: "+380", flag: "🇺🇦", isoCode: "UA", currency: "UAH", currencySymbol: "₴" },
  { name: "United Kingdom", code: "+44", flag: "🇬🇧", isoCode: "GB", currency: "GBP", currencySymbol: "£" },
  { name: "Vatican City", code: "+379", flag: "🇻🇦", isoCode: "VA", currency: "EUR", currencySymbol: "€" },

  // Key International Partners
  { name: "Australia", code: "+61", flag: "🇦🇺", isoCode: "AU", currency: "AUD", currencySymbol: "$" },
  { name: "New Zealand", code: "+64", flag: "🇳🇿", isoCode: "NZ", currency: "NZD", currencySymbol: "$" },
  { name: "Japan", code: "+81", flag: "🇯🇵", isoCode: "JP", currency: "JPY", currencySymbol: "¥" },
  { name: "Singapore", code: "+65", flag: "🇸🇬", isoCode: "SG", currency: "SGD", currencySymbol: "$" },
  { name: "United Arab Emirates", code: "+971", flag: "🇦🇪", isoCode: "AE", currency: "AED", currencySymbol: "AED" },
  { name: "India", code: "+91", flag: "🇮🇳", isoCode: "IN", currency: "INR", currencySymbol: "₹" },
  { name: "Brazil", code: "+55", flag: "🇧🇷", isoCode: "BR", currency: "BRL", currencySymbol: "R$" },
  { name: "South Africa", code: "+27", flag: "🇿🇦", isoCode: "ZA", currency: "ZAR", currencySymbol: "R" },
  { name: "Pakistan", code: "+92", flag: "🇵🇰", isoCode: "PK", currency: "PKR", currencySymbol: "₨" },
];

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name?: string;
  countryName?: string;
}

export function getCurrencyForCountry(countryName?: string | null): CurrencyConfig {
  if (!countryName) {
    return { code: "CAD", symbol: "$", name: "Canadian Dollar", countryName: "Canada" };
  }
  const clean = countryName.trim().toLowerCase();
  const found = SUPPORTED_COUNTRIES.find(
    (c) => c.name.toLowerCase() === clean || c.isoCode.toLowerCase() === clean
  );
  if (found) {
    return { 
      code: found.currency, 
      symbol: found.currencySymbol, 
      name: found.currency === "CAD" ? "Canadian Dollar" : found.currency === "GBP" ? "British Pound" : found.currency === "EUR" ? "Euro" : found.currency === "USD" ? "US Dollar" : found.currency,
      countryName: found.name 
    };
  }
  return { code: "CAD", symbol: "$", name: "Canadian Dollar", countryName: "Canada" };
}