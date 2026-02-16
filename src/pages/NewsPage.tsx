import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Award, Mic, Newspaper, Gift, Calendar } from 'lucide-react';
import { useJsonData } from '@/hooks/useJsonData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { NewsItem } from '@/types';

const typeIcons: Record<string, React.ReactNode> = {
  award: <Award className="h-4 w-4" aria-hidden="true" />,
  keynote: <Mic className="h-4 w-4" aria-hidden="true" />,
  media: <Newspaper className="h-4 w-4" aria-hidden="true" />,
  grant: <Gift className="h-4 w-4" aria-hidden="true" />,
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function NewsPage() {
  const { data: news, loading } = useJsonData<NewsItem[]>('news.json', []);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const types = useMemo(() => [...new Set(news.map(n => n.type))], [news]);
  const filtered = useMemo(() => {
    const r = typeFilter === 'all' ? news : news.filter(n => n.type === typeFilter);
    return [...r].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [news, typeFilter]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="sr-only">Loading content…</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">News & Talks</h1>
      <p className="mb-8 text-muted-foreground">Recent activities, awards, and presentations.</p>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        <Button variant={typeFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setTypeFilter('all')} className="text-xs" aria-pressed={typeFilter === 'all'}>All</Button>
        {types.map(t => (
          <Button key={t} variant={typeFilter === t ? 'default' : 'outline'} size="sm" onClick={() => setTypeFilter(t)} className="text-xs capitalize" aria-pressed={typeFilter === t}>{t}</Button>
        ))}
      </div>

      <div className="relative border-l-2 border-border pl-6 space-y-6" aria-label="News timeline" role="feed">
        {filtered.map(item => (
          <motion.article key={item.id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="relative">
            <div className="absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-border bg-background text-primary" aria-hidden="true">
              {typeIcons[item.type] || <Calendar className="h-3 w-3" />}
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                <time className="text-xs text-muted-foreground" dateTime={item.date}>{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time>
              </div>
              <h3 className="font-sans text-sm font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
                {item.link && (
                  <> {' '}
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                      more…
                      <span className="sr-only"> about {item.title} (opens in new tab)</span>
                    </a>
                  </>
                )}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
