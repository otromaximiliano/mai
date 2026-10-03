import { siteConfig } from "@/config/site-config";
import { formatCurrency } from "./format-currency";

export interface OrderItemForWhatsApp {
  name: string;
  presentation?: string;
  price: number;
  quantity: number;
}

export interface WhatsAppOrderDetails {
  items: OrderItemForWhatsApp[];
  customerName?: string;
  customerNote?: string;
}

function calculateOrderTotal(items: OrderItemForWhatsApp[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatSingleItemLine(item: OrderItemForWhatsApp): string {
  const lineTotal = item.price * item.quantity;
  const presentationInfo = item.presentation ? ` (${item.presentation})` : "";
  return `• *${item.quantity}x* ${item.name}${presentationInfo} — ${formatCurrency(lineTotal)}`;
}

function buildOrderMessage(details: WhatsAppOrderDetails): string {
  const { whatsapp } = siteConfig;
  const itemsText = details.items.map(formatSingleItemLine).join("\n");
  const grandTotal = calculateOrderTotal(details.items);

  let message = `${whatsapp.orderPrefixMessage}`;
  message += `${itemsText}\n\n`;
  message += `💰 *Total Estimado:* ${formatCurrency(grandTotal)}\n`;

  if (details.customerName && details.customerName.trim().length > 0) {
    message += `👤 *Cliente:* ${details.customerName.trim()}\n`;
  }

  if (details.customerNote && details.customerNote.trim().length > 0) {
    message += `📝 *Nota / Dirección:* ${details.customerNote.trim()}\n`;
  }

  message += whatsapp.orderFooterMessage;
  return message;
}

export function generateWhatsAppUrl(details?: WhatsAppOrderDetails): string {
  const phone = siteConfig.whatsapp.phoneNumber.replace(/\D/g, "");

  if (!details || details.items.length === 0) {
    const defaultText = encodeURIComponent(siteConfig.whatsapp.welcomeMessage);
    return `https://wa.me/${phone}?text=${defaultText}`;
  }

  const message = buildOrderMessage(details);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
