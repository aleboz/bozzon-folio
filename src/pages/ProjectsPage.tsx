import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useJsonData } from '@/hooks/useJsonData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function ProjectsPage() {
  const { data: projects, loading } = useJsonData<Project[]>('projects.json', []);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>('all');

  const themes = useMemo(() => [...new Set(projects.flatMap(p => p.themes))].sort(), [projects]);
  const filtered = useMemo(() => {
    let r = [...projects];
    if (statusFilter !== 'all') r = r.filter(p => p.status === statusFilter);
    if (themeFilter !== 'all') r = r.filter(p => p.themes.includes(themeFilter));
    return r;
  }, [projects, statusFilter, themeFilter]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="sr-only">Loading content…</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">Projects</h1>
      <p className="mb-8 text-muted-foreground">Research projects, labs, and initiatives.</p>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter projects">
        {['all', 'active', 'completed'].map(s => (
          <Button key={s} variant={statusFilter === s ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter(s)} className="text-xs capitalize" aria-pressed={statusFilter === s}>
            {s === 'all' ? 'All' : s}
          </Button>
        ))}
        {themes.map(t => (
          <Button key={t} variant={themeFilter === t ? 'default' : 'outline'} size="sm" onClick={() => setThemeFilter(themeFilter === t ? 'all' : t)} className="text-xs" aria-pressed={themeFilter === t}>
            {t}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map(project => (
          <motion.article key={project.id} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
            className="rounded-lg border bg-card p-6 transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">{project.status}</Badge>
              <span className="text-xs text-muted-foreground">{project.timeframe}</span>
            </div>
            <h2 className="mb-1 font-sans text-lg font-semibold">{project.title}</h2>
            <p className="mb-1 text-sm font-medium text-primary">{project.role}</p>
            <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{project.description}</p>
            {project.collaborators.length > 0 && (
              <p className="mb-3 text-xs text-muted-foreground">With: {project.collaborators.join(', ')}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {project.themes.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
            </div>
            {Object.entries(project.links).length > 0 && (
              <div className="mt-3 flex gap-2">
                {Object.entries(project.links).map(([label, url]) => (
                  <Button key={label} variant="ghost" size="sm" asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs capitalize">
                      {label} <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                      <span className="sr-only">(opens in new tab)</span>
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </div>
  );
}
