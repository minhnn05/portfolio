/**
 * Client-side slugify — dùng khi preview slug trên admin form.
 * Logic tương đồng với backend utils/slug.py
 */
export function slugify(text, maxLength = 200) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   // bỏ dấu
    .replace(/[đĐ]/g, 'd')             // đ → d
    .replace(/[^a-z0-9\s-]/g, '')      // bỏ ký tự đặc biệt
    .replace(/[\s_]+/g, '-')           // space/underscore → dash
    .replace(/-{2,}/g, '-')            // nhiều dash → 1
    .replace(/^-+|-+$/g, '')           // trim dash
    .slice(0, maxLength);
}
