/**
 * WhatsApp Deep Link Protocol Engine
 * As specified in TRD Section 2.3 and AFD Flow 4.
 */

export interface WhatsAppLinkResult {
  phoneNumber: string;
  rawMessage: string;
  encodedMessage: string;
  deepLink: string;
  webLink: string;
}

export function normalizePhoneNumber(phone: string): string {
  // Strip non-numeric characters
  let clean = phone.replace(/[^0-9]/g, "");

  // If starts with '08', convert to '628' (Indonesian standard)
  if (clean.startsWith("08")) {
    clean = "62" + clean.substring(1);
  }

  // If starts with '+62', strip plus
  if (clean.startsWith("62")) {
    return clean;
  }

  // Fallback: return clean number
  return clean;
}

export function formatWhatsAppMessage(
  galleryTitle: string,
  filenames: string[],
  clientName?: string,
  clientNotes?: string
): string {
  let message = `Halo Kak, berikut daftar foto terpilih untuk *${galleryTitle}*`;
  if (clientName && clientName.trim()) {
    message += ` dari *${clientName.trim()}*`;
  }
  message += `:\n\n`;

  message += `📸 *Daftar Foto Terpilih (Total: ${filenames.length} Foto):*\n`;
  filenames.forEach((name, index) => {
    message += `${index + 1}. ${name}\n`;
  });

  if (clientNotes && clientNotes.trim()) {
    message += `\n📝 *Catatan Tambahan:*\n"${clientNotes.trim()}"\n`;
  }

  message += `\nTotal: ${filenames.length} Foto.\nTerima kasih! ✨`;
  return message;
}

export function generateWhatsAppLink(
  phoneNumber: string,
  galleryTitle: string,
  filenames: string[],
  clientName?: string,
  clientNotes?: string
): WhatsAppLinkResult {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  const rawMessage = formatWhatsAppMessage(galleryTitle, filenames, clientName, clientNotes);
  const encodedMessage = encodeURIComponent(rawMessage);

  return {
    phoneNumber: cleanPhone,
    rawMessage,
    encodedMessage,
    deepLink: `https://wa.me/${cleanPhone}?text=${encodedMessage}`,
    webLink: `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`,
  };
}
