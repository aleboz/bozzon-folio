import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, ExternalLink, Copy, Check, FileText, Code2, Database,
  Video, Presentation, ChevronDown, ChevronUp, Download, Filter, Award
} from 'lucide-react';
import { useJsonData } from '@/hooks/useJsonData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Publication } from '@/types';

const TYPE_LABELS: Record<string, string> = {
  journal: 'Journal', conference: 'Conference', workshop: 'Workshop',
  book_chapter: 'Book Chapter', preprint: 'Preprint',
};

function CopyBibtex({ bibtex }: { bibtex: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [bibtex]);
  return (
    <Button variant="ghost" size="sm" onClick={copy} aria-label="Copy BibTeX">
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      <span className="ml-1 text-xs">BibTeX</span>
    </Button>
  );
}

export default function PublicationsPage() {
  const { data: pubs, loading } = useJsonData<Publication[]>('publications.json', []);
  const [searchParams] = useSearchParams();
  const initialTheme = searchParams.get('theme') || '';

  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [themeFilter, setThemeFilter] = useState<string>(initialTheme || 'all');
  const [sortBy, setSortBy] = useState<string>('year-desc');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const years = useMemo(() => [...new Set(pubs.map(p => p.year))].sort((a, b) => b - a), [pubs]);
  const types = useMemo(() => [...new Set(pubs.map(p => p.type))], [pubs]);
  const themes = useMemo(() => [...new Set(pubs.flatMap(p => p.themes))].sort(), [pubs]);
  const coAuthors = useMemo(() => {
    const set = new Set<string>();
    pubs.forEach(p => p.authors.forEach(a => set.add(a)));
    return [...set].sort();
  }, [pubs]);
  const [authorFilter, setAuthorFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    let result = [...pubs];
    if (featuredOnly) result = result.filter(p => p.featured);
    if (yearFilter !== 'all') result = result.filter(p => p.year === Number(yearFilter));
    if (typeFilter !== 'all') result = result.filter(p => p.type === typeFilter);
    if (themeFilter !== 'all') result = result.filter(p => p.themes.includes(themeFilter));
    if (authorFilter !== 'all') result = result.filter(p => p.authors.includes(authorFilter));
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.venue.toLowerCase().includes(q) ||
        p.authors.some(a => a.toLowerCase().includes(q)) ||
        p.keywords.some(k => k.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      if (sortBy === 'year-desc') return b.year - a.year;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [pubs, query, yearFilter, typeFilter, themeFilter, authorFilter, sortBy, featuredOnly]);

  const downloadAllBibtex = useCallback(() => {
    const bibtex = filtered.filter(p => p.bibtex).map(p => p.bibtex).join('\n\n');
    const blob = new Blob([bibtex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'publications.bib'; a.click();
    URL.revokeObjectURL(url);
  }, [filtered]);

  const clearFilters = () => {
    setQuery(''); setYearFilter('all'); setTypeFilter('all');
    setThemeFilter('all'); setAuthorFilter('all'); setFeaturedOnly(false);
  };

  const hasFilters = query || yearFilter !== 'all' || typeFilter !== 'all' || themeFilter !== 'all' || authorFilter !== 'all' || featuredOnly;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <span className="sr-only">Loading publications…</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">Publications</h1>
        <p className="text-muted-foreground">{filtered.length} of {pubs.length} publications</p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search titles, authors, venues, keywords..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-10"
              aria-label="Search publications"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-44" aria-label="Sort publications">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year-desc">Year (newest)</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-28" aria-label="Filter by year"><SelectValue placeholder="Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All years</SelectItem>
              {years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36" aria-label="Filter by type"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {types.map(t => <SelectItem key={t} value={t}>{TYPE_LABELS[t] || t}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={themeFilter} onValueChange={setThemeFilter}>
            <SelectTrigger className="w-44" aria-label="Filter by theme"><SelectValue placeholder="Theme" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All themes</SelectItem>
              {themes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={authorFilter} onValueChange={setAuthorFilter}>
            <SelectTrigger className="w-48" aria-label="Filter by co-author"><SelectValue placeholder="Co-author" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All authors</SelectItem>
              {coAuthors.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>

          <Button
            variant={featuredOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFeaturedOnly(!featuredOnly)}
            className="text-xs"
            aria-pressed={featuredOnly}
          >
            ★ Selected
          </Button>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              <X className="mr-1 h-3 w-3" /> Clear
            </Button>
          )}
        </div>

        {filtered.some(p => p.bibtex) && (
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={downloadAllBibtex}>
              <Download className="mr-1 h-3 w-3" /> Download BibTeX ({filtered.filter(p => p.bibtex).length})
            </Button>
          </div>
        )}
      </div>

      {/* Publication list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map(pub => (
            <motion.article
              key={pub.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="rounded-lg border bg-card p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs shrink-0">{TYPE_LABELS[pub.type] || pub.type}</Badge>
                    <span className="text-xs text-muted-foreground">{pub.year}</span>
                    {pub.awards.map(a => (
                      <Badge key={a} variant="secondary" className="text-xs border-0 font-medium">
                        <Award className="mr-1 h-3 w-3" />{a}
                      </Badge>
                    ))}
                    {pub.featured && <Badge variant="secondary" className="text-xs">★ Selected</Badge>}
                  </div>
                  <h3 className="mb-1 font-sans text-base font-semibold leading-snug text-foreground">{pub.title}</h3>
                  <p className="mb-1 text-sm text-muted-foreground">{pub.authors.join(', ')}</p>
                  <p className="text-sm text-muted-foreground italic">{pub.venueShort || pub.venue}</p>
                </div>
              </div>

              {/* Links */}
              <div className="mt-3 flex flex-wrap items-center gap-1">
                {pub.doi && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-1 h-3 w-3" /><span className="text-xs">DOI</span>
                    </a>
                  </Button>
                )}
                {pub.pdf && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={pub.pdf} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-1 h-3 w-3" /><span className="text-xs">PDF</span>
                    </a>
                  </Button>
                )}
                {pub.code && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={pub.code} target="_blank" rel="noopener noreferrer">
                      <Code2 className="mr-1 h-3 w-3" /><span className="text-xs">Code</span>
                    </a>
                  </Button>
                )}
                {pub.dataset && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={pub.dataset} target="_blank" rel="noopener noreferrer">
                      <Database className="mr-1 h-3 w-3" /><span className="text-xs">Data</span>
                    </a>
                  </Button>
                )}
                {pub.video && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={pub.video} target="_blank" rel="noopener noreferrer">
                      <Video className="mr-1 h-3 w-3" /><span className="text-xs">Video</span>
                    </a>
                  </Button>
                )}
                {pub.slides && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={pub.slides} target="_blank" rel="noopener noreferrer">
                      <Presentation className="mr-1 h-3 w-3" /><span className="text-xs">Slides</span>
                    </a>
                  </Button>
                )}
                {pub.bibtex && <CopyBibtex bibtex={pub.bibtex} />}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedId(expandedId === pub.id ? null : pub.id)}
                  aria-label={expandedId === pub.id ? 'Hide abstract' : 'Show abstract'}
                >
                  {expandedId === pub.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  <span className="ml-1 text-xs">Abstract</span>
                </Button>
              </div>

              <AnimatePresence>
                {expandedId === pub.id && pub.abstract && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
                    {pub.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pub.keywords.map(k => <Badge key={k} variant="outline" className="text-xs">{k}</Badge>)}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg">No publications match your filters.</p>
          <Button variant="link" onClick={clearFilters}>Clear all filters</Button>
        </div>
      )}
    </div>
  );
}
