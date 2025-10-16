
import { MetadataRoute } from 'next'
import {locales} from '@/i18n';
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://upipg.cit.org.in';

  const staticPages = ['', '/about', '/developers', '/terms', '/privacy'];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  locales.forEach(locale => {
    staticPages.forEach(page => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
