import { motion } from 'framer-motion';
import bioPhoto from '@/assets/bio-photo-2024.jpeg';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Download, ExternalLink, GraduationCap,
  Award, Building2, Brain, Library, Trophy, Globe, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import profileData from '@/data/profile.json';
import newsData from '@/data/news.json';
import type { Profile, NewsItem } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  award: <Award className="h-5 w-5" aria-hidden="true" />,
  building: <Building2 className="h-5 w-5" aria-hidden="true" />,
  brain: <Brain className="h-5 w-5" aria-hidden="true" />,
  library: <Library className="h-5 w-5" aria-hidden="true" />,
  trophy: <Trophy className="h-5 w-5" aria-hidden="true" />,
  globe: <Globe className="h-5 w-5" aria-hidden="true" />,
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
  const profile = profileData as Profile;
  const news = newsData as NewsItem[];

  const recentNews = news
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/5 via-background to-accent/5" aria-label="Introduction">
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
                <Link to="/publications"><BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />Publications</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/projects">Projects</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/contact">Contact</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={profile.links.scholar} target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="mr-1 h-4 w-4" aria-hidden="true" />Scholar
                  <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href={profile.links.dblp} target="_blank" rel="noopener noreferrer">
                  DBLP
                  <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                  <span className="sr-only">(opens in new tab)</span>
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>


      {/* Highlights */}
      <section className="container mx-auto px-4 py-16" aria-label="Highlights">
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
                  <div className="rounded-md bg-primary/10 p-2 text-primary" aria-hidden="true">
                    {iconMap[h.icon] || <Sparkles className="h-5 w-5" />}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{h.year}</span>
                </div>
                <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">
                  {h.link ? (
                    <a href={h.link} target="_blank" rel="noopener noreferrer" className="underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors">
                      {h.title}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : h.title}
                </h3>
                <p className="text-sm text-muted-foreground">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Recent News */}
      <section className="border-t bg-muted/30" aria-label="Recent news">
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
                      <time dateTime={item.date}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                    </span>
                  </div>
                  <h3 className="mb-1 font-sans text-sm font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                    {item.link && (
                      <> {' '}
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:underline">
                          more… <ExternalLink className="ml-0.5 inline h-3 w-3" aria-hidden="true" />
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                      </>
                    )}
                  </p>
                </motion.div>
              ))}
            </div>
            <motion.div variants={fadeUp} className="mt-8 text-center">
              <Button variant="outline" asChild>
                <Link to="/news">All News & Talks <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bio */}
      <section className="border-t bg-muted/30" aria-label="Biography">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 font-display text-2xl font-semibold md:text-3xl">About</h2>
            <div className="flex flex-col gap-8 md:flex-row">
              <div className="shrink-0">
                <img
                  src={bioPhoto}
                  alt="Portrait of Alessandro Bozzon"
                  className="w-48 rounded-lg object-cover shadow-md md:w-56"
                  loading="lazy"
                />
              </div>
              <div>
                {profile.bioLong.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 text-base leading-relaxed text-muted-foreground">{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
