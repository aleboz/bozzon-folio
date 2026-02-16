export interface Profile {
  name: string;
  titles: string[];
  affiliation: string;
  bioShort: string;
  bioLong: string;
  portraitImagePath: string;
  cvPdfPath: string;
  researchStatement: string;
  links: {
    scholar: string;
    dblp: string;
    linkedin: string;
    bluesky: string;
    email: string;
    github: string;
    orcid: string;
  };
  highlights: Highlight[];
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
  year: number;
  link?: string;
}

export interface Metrics {
  citationsTotal: number;
  hIndex: number;
  i10Index: number;
  totalPublications: number;
  recentYearPublications: number;
  recentYear: number;
  lastUpdatedISO: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: 'journal' | 'conference' | 'workshop' | 'book_chapter' | 'preprint';
  venue: string;
  venueShort?: string;
  doi: string;
  url: string;
  pdf: string;
  code: string;
  dataset: string;
  slides: string;
  video: string;
  abstract: string;
  keywords: string[];
  themes: string[];
  featured: boolean;
  citations: number;
  awards: string[];
  bibtex: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  status: 'active' | 'completed';
  timeframe: string;
  collaborators: string[];
  themes: string[];
  image: string;
  links: Record<string, string>;
}

export interface Course {
  id: string;
  name: string;
  level: string;
  years: string;
  description: string;
  links: Record<string, string>;
}

export interface Supervision {
  name: string;
  level: string;
  years: string;
  topic: string;
  outcome: string;
  coSupervisors: string[];
}

export interface ServiceData {
  leadership: ServiceEntry[];
  editorial: ServiceEntry[];
  programCommittees: ServiceEntry[];
  initiatives: ServiceEntry[];
}

export interface ServiceEntry {
  role: string;
  organization?: string;
  venue?: string;
  years?: string;
  year?: number;
}

export interface NewsItem {
  id: string;
  date: string;
  type: string;
  title: string;
  description: string;
  link: string;
}

export interface ContactData {
  email: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    line3: string;
    country: string;
  };
  office: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
