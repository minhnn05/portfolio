export function slugify(text, maxLength = 200) {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')   
    .replace(/[đĐ]/g, 'd')            
    .replace(/[^a-z0-9\s-]/g, '')    
    .replace(/[\s_]+/g, '-')          
    .replace(/-{2,}/g, '-')          
    .replace(/^-+|-+$/g, '')          
    .slice(0, maxLength);
}
