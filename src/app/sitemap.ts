import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://shaids-acpce.org';

    const routes = [
        '',
        '/about',
        '/about/overview',
        '/about/messages',
        '/events',
        '/events/fests/vectors',
        '/events/fests/kurukshetra',
        '/events/fests/rhythms',
        '/team',
        '/projects',
        '/resources',
        '/magazine',
    ];

    return routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/events' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : route.startsWith('/events') ? 0.9 : 0.8,
    }));
}
