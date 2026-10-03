import { siteConfig } from "@/config/site-config";

function formatIntegerWithSeparators(amount: number, separator: string): string {
  const rounded = Math.round(amount);
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Consultar";
  }

  const { symbol, position, thousandsSeparator } = siteConfig.currency;
  const formattedNumber = formatIntegerWithSeparators(amount, thousandsSeparator);

  if (position === "prefix") {
    return `${symbol} ${formattedNumber}`;
  }

  return `${formattedNumber} ${symbol}`;
}
