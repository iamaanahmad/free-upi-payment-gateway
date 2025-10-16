
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://upipg.cit.org.in';
  const locales = [
    'en', 'hi', 'bn-IN', 'gu-IN', 'mr-IN', 'te-IN',
    'ta-IN', 'kn-IN', 'ml-IN', 'pa-IN', 'or-IN', 'ur-IN'
  ];

  const pages = [
    { path: '', priority: 1, changeFrequency: 'yearly' as const },
    { path: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/developers', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate URLs for all locales and pages
  locales.forEach(locale => {
    const localePrefix = locale === 'en' ? '' : `/${locale}`;

    pages.forEach(page => {
      sitemap.push({
        url: `${baseUrl}${localePrefix}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(loc => [
              loc,
              `${baseUrl}${loc === 'en' ? '' : `/${loc}`}${page.path}`
            ])
          )
        }
      });
    });
  });

  return sitemap;
}
