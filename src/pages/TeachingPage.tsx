import { motion } from 'framer-motion';
import { ExternalLink, GraduationCap, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import coursesData from '@/data/teaching.json';
import supervisionData from '@/data/supervision.json';
import type { Course, Supervision } from '@/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function TeachingPage() {
  const courses = coursesData as Course[];
  const supervision = supervisionData as Supervision[];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold md:text-4xl">Teaching & Supervision</h1>
      <p className="mb-10 text-muted-foreground">Courses, seminars, and research supervision.</p>

      {/* Courses */}
      <section className="mb-12" aria-label="Courses">
        <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" /> Courses
        </h2>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid gap-4 md:grid-cols-2">
          {courses.map(course => (
            <motion.article key={course.id} variants={fadeUp} className="rounded-lg border bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">{course.level}</Badge>
                <span className="text-xs text-muted-foreground">{course.years}</span>
              </div>
              <h3 className="mb-1 font-sans text-base font-semibold">{course.name}</h3>
              <p className="text-sm text-muted-foreground">{course.description}</p>
              {Object.entries(course.links).filter(([, v]) => v).map(([label, url]) => (
                <Button key={label} variant="ghost" size="sm" asChild className="mt-2">
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs capitalize">
                    {label} <ExternalLink className="ml-1 h-3 w-3" aria-hidden="true" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </Button>
              ))}
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* Supervision */}
      <section aria-label="Supervision">
        <h2 className="mb-6 flex items-center gap-2 font-display text-2xl font-semibold">
          <Users className="h-6 w-6 text-primary" aria-hidden="true" /> Supervision
        </h2>
        <div className="space-y-3">
          {supervision.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
              className="flex flex-col gap-1 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">{s.level}</Badge>
                  <span className="text-xs text-muted-foreground">{s.years}</span>
                </div>
                {s.name && <p className="font-sans text-sm font-semibold">{s.name}</p>}
                <p className="text-sm text-muted-foreground">{s.topic}</p>
                {s.coSupervisors.length > 0 && (
                  <p className="text-xs text-muted-foreground">Co-supervised with: {s.coSupervisors.join(', ')}</p>
                )}
              </div>
              {s.outcome && (
                <p className="text-xs text-primary font-medium shrink-0">{s.outcome}</p>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
