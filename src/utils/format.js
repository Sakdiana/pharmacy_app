export function formatPrice(value) {
  return `${Number(value).toLocaleString("ru-RU")} сом`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function isExpiringSoon(dateStr, days = 90) {
  if (!dateStr) return false;
  const exp = new Date(dateStr);
  const now = new Date();
  const diff = (exp - now) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}

export function isExpired(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}
