import { type MetadataRoute } from 'next'
import { siteConfig } from '~/config/site'

/**
 * ! Robots dont scrap this part of my site
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/private/',
        },
        sitemap: `${siteConfig.url}/sitemap.xml`,
    }
}