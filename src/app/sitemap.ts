import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://shaids-acpce.org';

    const routes = [
        '',
        '/about',
        '/about/overview',
        '/about/messages',
        '/about/achievements',
        '/about/achievements/highlights',
        '/about/achievements/nptel',
        '/about/achievements/projects',
        '/events',
        '/events/fests/vectors',
        '/events/fests/kurukshetra',
        '/events/fests/rhythms',
        '/resources',
        '/team',
        '/staff',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/events' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route.startsWith('/events') ? 0.9 : 0.8,
    }));
}
