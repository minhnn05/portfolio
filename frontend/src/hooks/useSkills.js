import { useEffect, useState } from 'react';
import { skillService } from '../services/skillService';

/** Fetch skills grouped by category — dùng cho trang Skills và SkillsPreview. */
export function useSkillsGrouped() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    skillService
      .getGrouped()
      .then((data) => { if (!cancelled) setGroups(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { groups, isLoading, error };
}

/** Fetch flat list of all skills. */
export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    skillService
      .getAll()
      .then((data) => { if (!cancelled) setSkills(data); })
      .catch((err) => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return { skills, isLoading, error };
}
