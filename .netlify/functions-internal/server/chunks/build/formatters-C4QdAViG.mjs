const formatCurrency = (amount, currency = "IDR") => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};
const formatDate = (date, options) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", options || {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(d);
};
const formatDateShort = (date) => {
  return formatDate(date, { day: "numeric", month: "short", year: "numeric" });
};

export { formatCurrency as a, formatDateShort as b, formatDate as f };
//# sourceMappingURL=formatters-C4QdAViG.mjs.map
