// Currency & Date Formatting Utilities for Vietnam E-Commerce

export const formatCurrency = (amount: number): string => {
  if (isNaN(amount) || amount === undefined || amount === null) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount).replace('VND', '₫').replace('₫', ' ₫').trim();
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatDateTime = formatDate;

export const formatDateOnly = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
};

export const calculateDiscountPercentage = (original: number, sale?: number): number => {
  if (!sale || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
};

export const generateOrderNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SV-${year}-${randomSuffix}`;
};
