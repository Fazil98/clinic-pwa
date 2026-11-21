/** Private mailboxes. They are never shown and never mailed. */
const ACCOUNTS: Record<string, string> = {
  فاطمة: "doctor@obgyn.clinic",
  دكتورةفاطمة: "doctor@obgyn.clinic",
  "د.فاطمة": "doctor@obgyn.clinic",
  دكتورة: "doctor@obgyn.clinic",
  doctor: "doctor@obgyn.clinic",
  fatima: "doctor@obgyn.clinic",
  "doctor@obgyn.clinic": "doctor@obgyn.clinic",
  مساعدة: "helper@obgyn.clinic",
  سكرتيرة: "helper@obgyn.clinic",
  helper: "helper@obgyn.clinic",
  secretary: "helper@obgyn.clinic",
  "helper@obgyn.clinic": "helper@obgyn.clinic",
};

export function staffEmail(name: string): string | null {
  const key = name.trim().toLowerCase().replace(/\s+/g, "");
  return ACCOUNTS[key] ?? null;
}
