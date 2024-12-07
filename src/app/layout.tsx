// root layout is a server component

import "~/styles/globals.css";

import { AppLayout } from "@components/app-layout";
import { getSession } from "@lib/sessions";
import { ThemeProvider } from "@providers/theme-provider";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { headers } from "next/headers";
import { type PropsWithChildren } from "react";
import { Toaster } from "~/_providers/toaster";
import { siteConfig } from "~/config/site";
import { AUTH_ROUTES, handleAuthRedirects } from "./_routes/auth-route";
import SideNav from "./sidenav";
import TopNav from "./topnav";

export const metadata: Metadata = {
  title: siteConfig.name,
  applicationName: siteConfig.name,
  description: siteConfig.description,
  creator: siteConfig.creator,
  keywords: siteConfig.keywords,
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
};

type LayoutProps = PropsWithChildren<{
  modals: React.ReactNode;
}>;

export default async function RootLayout({ children, modals }: LayoutProps) {
  const isAuth = await getSession();
  const headersList = headers();
  const headerPathname = headersList.get("x-pathname") ?? "";
  const isRoot = headersList.get("x-a3root") === "yes" && isAuth !== false;

  handleAuthRedirects(isAuth, { pathname: headerPathname, a3root: isRoot });

  return (
    <html lang="fr" className={`${GeistSans.variable}`}>
      {/* <CSPostHogProvider> */}
      <body className="h-full w-full">
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          {isAuth && !AUTH_ROUTES.app.public.includes(headerPathname) ? (
            <AppLayout
              TopNav={<TopNav isRoot={isRoot} />}
              SideNav={<SideNav isRoot={isRoot} />}
            >
              {children}
              {modals}
              {modals && <div id="modal-root" />}
              <Toaster />
            </AppLayout>
          ) : (
            children
          )}
        </ThemeProvider>
      </body>
      {/* </CSPostHogProvider> */}
    </html>
  );
}
