/**
 * Format ISO date string thành dạng dễ đọc.
 */

const VI_LOCALE = 'vi-VN';

/** "15 tháng 6, 2026" */
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(VI_LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** "15/06/2026" */
export function formatDateShort(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(VI_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** "15 th6, 2026" — dùng cho blog card */
export function formatDateCompact(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString(VI_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Relative time: "3 ngày trước" */
export function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);

  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 30) return `${days} ngày trước`;
  return formatDateCompact(iso);
}
