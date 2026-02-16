import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Building2, Copy, Check, ExternalLink, GraduationCap, BookOpen, Linkedin, Cloud, Github, Fingerprint } from 'lucide-react';
import { useJsonData } from '@/hooks/useJsonData';
import { Button } from '@/components/ui/button';
import type { ContactData } from '@/types';

const iconMap: Record<string, React.ReactNode> = {
  'graduation-cap': <GraduationCap className="h-4 w-4" aria-hidden="true" />,
  'book-open': <BookOpen className="h-4 w-4" aria-hidden="true" />,
  linkedin: <Linkedin className="h-4 w-4" aria-hidden="true" />,
  cloud: <Cloud className="h-4 w-4" aria-hidden="true" />,
  github: <Github className="h-4 w-4" aria-hidden="true" />,
  fingerprint: <Fingerprint className="h-4 w-4" aria-hidden="true" />,
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function ContactPage() {
  const { data, loading } = useJsonData<ContactData | null>('contact.json', null);
  const [copied, setCopied] = useState(false);

  const copyEmail = useCallback(() => {
    if (!data) return;
    navigator.clipboard.writeText(data.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <span className="sr-only">Loading content…</span>
    </div>
  );
  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        <motion.h1 variants={fadeUp} className="mb-2 font-display text-3xl font-bold md:text-4xl">Contact</motion.h1>
        <motion.p variants={fadeUp} className="mb-10 text-muted-foreground">Get in touch for collaborations, speaking invitations, or inquiries.</motion.p>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Email */}
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-sans text-lg font-semibold">Email</h2>
              </div>
              <div className="flex items-center gap-2">
                <a href={`mailto:${data.email}`} className="text-primary hover:underline">{data.email}</a>
                <Button variant="ghost" size="icon" onClick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'} className="h-8 w-8">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Button asChild className="mt-3">
                <a href={`mailto:${data.email}`}><Mail className="mr-2 h-4 w-4" aria-hidden="true" />Send Email</a>
              </Button>
            </div>

            {/* Address */}
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-sans text-lg font-semibold">Address</h2>
              </div>
              <address className="not-italic">
                <p className="text-sm text-muted-foreground">{data.address.line1}</p>
                <p className="text-sm text-muted-foreground">{data.address.line2}</p>
                <p className="text-sm text-muted-foreground">{data.address.line3}</p>
                <p className="text-sm text-muted-foreground">{data.address.country}</p>
              </address>
              {data.office && (
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <Building2 className="h-3 w-3" aria-hidden="true" /> {data.office}
                </p>
              )}
            </div>
          </motion.div>

          {/* Social links */}
          <motion.div variants={fadeUp}>
            <nav className="rounded-lg border bg-card p-6" aria-label="Online profiles">
              <h2 className="mb-4 font-sans text-lg font-semibold">Online Profiles</h2>
              <div className="space-y-2">
                {data.socialLinks.map(link => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-md p-3 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="text-primary" aria-hidden="true">{iconMap[link.icon] || <ExternalLink className="h-4 w-4" />}</span>
                    <span className="font-medium">{link.platform}</span>
                    <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" aria-hidden="true" />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
