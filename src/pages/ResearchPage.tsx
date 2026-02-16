import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const themes = [
  {
    id: 'human-centered-ai',
    title: 'Human-Centered AI',
    description: 'Designing AI systems that are transparent, fair, and aligned with human values. Combining HCI methods with ML to create AI that augments human capabilities.',
    keywords: ['Explainability', 'Fairness', 'Trust', 'User Studies', 'Participatory Design'],
  },
  {
    id: 'crowd-computing',
    title: 'Crowd Computing',
    description: 'Harnessing collective human intelligence for complex tasks. Developing methods for quality control, task design, and worker modeling in crowdsourcing systems.',
    keywords: ['Crowdsourcing', 'Task Design', 'Quality Control', 'Worker Modeling', 'Hybrid Intelligence'],
  },
  {
    id: 'human-in-the-loop-ml',
    title: 'Human-in-the-Loop ML',
    description: 'Integrating human feedback into machine learning pipelines for data labeling, model validation, and active learning in domains requiring expert judgment.',
    keywords: ['Active Learning', 'Data Annotation', 'Interactive ML', 'Expert-in-the-Loop'],
  },
  {
    id: 'responsible-ai',
    title: 'Responsible & Value-Aligned AI',
    description: 'Investigating ethical implications of AI systems and developing frameworks for value-sensitive design, accountability, and responsible deployment.',
    keywords: ['Value-Sensitive Design', 'Ethics', 'Accountability', 'Bias Mitigation', 'Governance'],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ResearchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
        <motion.h1 variants={fadeUp} className="mb-2 font-display text-3xl font-bold md:text-4xl">Research</motion.h1>
        <motion.p variants={fadeUp} className="mb-10 max-w-2xl text-muted-foreground">
          My research lies at the intersection of Human-Computer Interaction, human computation, user modelling, and machine learning, focusing on Human-Centered AI and Crowd Computing.
        </motion.p>

        <div className="grid gap-6 md:grid-cols-2" role="list">
          {themes.map(t => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="group rounded-lg border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
            >
              <h2 className="mb-2 font-display text-xl font-semibold">{t.title}</h2>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">{t.description}</p>
              <div className="mb-4 flex flex-wrap gap-2">
                {t.keywords.map(k => (
                  <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                ))}
              </div>
              <Link
                to={`/publications?theme=${encodeURIComponent(t.title)}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                View publications <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div variants={fadeUp} className="mt-12">
          <h2 className="mb-4 font-display text-xl font-semibold">Methods & Keywords</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'User Modeling', 'Machine Learning', 'Natural Language Processing', 'Information Retrieval',
              'Data Integration', 'Bayesian Optimization', 'Mixed Methods', 'Experimental Design',
              'Survey Research', 'Participatory Design', 'Conversational AI', 'Knowledge Graphs',
              'Urban Computing', 'Digital Libraries', 'Web Engineering',
            ].map(k => (
              <Badge key={k} variant="outline" className="text-xs">{k}</Badge>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
