import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ResearchPage from './pages/ResearchPage';
import PublicationsPage from './pages/PublicationsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeachingPage from './pages/TeachingPage';
import ServicePage from './pages/ServicePage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';

export async function prerender(data: { url?: string } = {}) {
  const url = data.url || '/';
  const queryClient = new QueryClient();

  const html = renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StaticRouter location={url}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/research" element={<ResearchPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/teaching" element={<TeachingPage />} />
              <Route path="/service" element={<ServicePage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </StaticRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );

  // Return links for route discovery + rendered HTML
  const links = [
    '/research',
    '/publications',
    '/projects',
    '/teaching',
    '/service',
    '/news',
    '/contact',
  ];

  return { html, links, data: { url } };
}
