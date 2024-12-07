const appUrl = {
    1: "http://localhost:3000",
    2: "https://abou3-stack.com"
}

export const siteConfig = {
    name: "iStock_Pro",
    description: "Gerer votre stock",
    url: appUrl[1],
    keywords: ["iStock Pro", "GESTION IPHONES", "IPHONES", "APPLICATION DE GESTION IPHONES"],
    creator: "Aboubacar Barry",
    defaultTheme: "light",
    links: [],
    // lng
    // metadataBase: new URL('https://acme.com'),
    // alternates: {
    //     canonical: '/',
    //     languages: {
    //         'en-US': '/en-US',
    //         'de-DE': '/de-DE',
    //     },
    // },
    // openGraph: {
    //     images: '/og-image.png',
    // },
}

export type SiteConfig = typeof siteConfig