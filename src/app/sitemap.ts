// generation dynamique des sites web avec next js
/**
 * sitemap globale
 * sitemap dynamic avec sitemap & generateSiteMaps
 * sitemap par route cible
 */

import { type MetadataRoute } from "next";
import { siteConfig } from "~/config/site";


export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${siteConfig.url}`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1, // decrease with links
        }
    ]
}   