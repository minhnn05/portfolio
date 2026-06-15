/**
 * Merge Tailwind class names — bỏ các giá trị falsy.
 * Dùng thay cho clsx vì không cần thêm dependency.
 *
 * cn('px-4', isActive && 'bg-blue-500', undefined) → 'px-4 bg-blue-500'
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
