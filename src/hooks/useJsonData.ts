import { useState, useEffect } from 'react';

export function useJsonData<T>(filename: string, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL || '/';
    const url = `${base}data/${filename}`;
    
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load ${filename}`);
        return res.json();
      })
      .then(json => {
        setData(json as T);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [filename]);

  return { data, loading, error };
}
