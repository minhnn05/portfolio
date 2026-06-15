import { useEffect, useState } from 'react';
import { blogService } from '../services/blogService';

/** Fetch danh sách blogs published với filter + pagination. */
export function useBlogs(params = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    blogService
      .getAll(params)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, isLoading, error };
}

/** Fetch single blog theo slug. */
export function useBlog(slug) {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);

    blogService
      .getBySlug(slug)
      .then((res) => { if (!cancelled) setBlog(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  return { blog, isLoading, error };
}

/** Fetch featured blogs cho Home. */
export function useFeaturedBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    blogService
      .getFeatured()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { blogs, isLoading };
}
