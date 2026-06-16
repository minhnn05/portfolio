import { useEffect, useState } from 'react';
import { projectService } from '../services/projectService';

/** Fetch danh sách projects published với filter + pagination. */
export function useProjects(params = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const key = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    projectService
      .getAll(params)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, isLoading, error };
}

/** Fetch single project theo slug. */
export function useProject(slug) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setIsLoading(true);

    projectService
      .getBySlug(slug)
      .then((res) => { if (!cancelled) setProject(res); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [slug]);

  return { project, isLoading, error };
}

/** Fetch featured projects cho Home. */
export function useFeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = () => {
    projectService
      .getFeatured()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetch();
    // Refetch khi user quay lại tab
    window.addEventListener('focus', fetch);
    return () => window.removeEventListener('focus', fetch);
  }, []);

  return { projects, isLoading };
}
