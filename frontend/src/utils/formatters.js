
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '0 ج.م';
  return `${amount.toLocaleString('ar-EG')} ج.م`;
};

