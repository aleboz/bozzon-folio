import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Download, ExternalLink, GraduationCap,
  Award, Building2, Brain, Library, Trophy, Globe, Sparkles
} from 'lucide-react';
import { useJsonData } from '@/hooks/useJsonData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Profile, NewsItem } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  award: <Award className="h-5 w-5" />,
  building: <Building2 className="h-5 w-5" />,
  brain: <Brain className="h-5 w-5" />,
  library: <Library className="h-5 w-5" />,
  trophy: <Trophy className="h-5 w-5" />,
  globe: <Globe className="h-5 w-5" />,
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  const { data: profile, loading: pLoading } = useJsonData<Profile | null>('profile.json', null);
  const { data: news } = useJsonData<NewsItem[]>('news.json', []);

  const recentNews = news
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  if (pLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={fadeUp} className="mb-2">
              <Badge variant="secondary" className="text-xs font-medium">
                {profile.affiliation}
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeUp} className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {profile.name}
            </motion.h1>
            <motion.p variants={fadeUp} className="mb-2 text-lg font-medium text-primary md:text-xl">
              {profile.titles[0]}
            </motion.p>
            <motion.p variants={fadeUp} className="mb-8 text-base text-muted-foreground md:text-lg leading-relaxed">
              {profile.researchStatement}
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link to="/publications"><BookOpen className="mr-2 h-4 w-4" />Publications</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/projects">Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={profile.links.scholar} target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="mr-1 h-4 w-4" />Scholar <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={profile.links.dblp} target="_blank" rel="noopener noreferrer">
                  DBLP <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Highlights */}
      <section className="container mx-auto px-4 py-16">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
          <motion.h2 variants={fadeUp} className="mb-8 text-center font-display text-2xl font-semibold md:text-3xl">
            Highlights
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.highlights.map((h, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="group rounded-lg border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    {iconMap[h.icon] || <Sparkles className="h-5 w-5" />}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{h.year}</span>
                </div>
                <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">{h.title}</h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recent News */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="mb-8 text-center font-display text-2xl font-semibold md:text-3xl">
              Recent News
            </motion.h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentNews.map((item) => (
                <motion.div key={item.id} variants={fadeUp} className="rounded-lg border bg-card p-5">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">{item.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link to="/news">All News & Talks <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 font-display text-2xl font-semibold md:text-3xl">About</h2>
            {profile.bioLong.split('\n\n').map((para, i) => (
              <p key={i} className="mb-4 text-base leading-relaxed text-muted-foreground">{para}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
