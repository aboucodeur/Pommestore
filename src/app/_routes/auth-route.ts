// 1. Admin hors de sa zone → redirection vers dashboard admin
// 2. Utilisateur non authentifié sur route privée → redirection vers login
// 3. Utilisateur authentifié sur route publique → redirection vers home
// 4. Utilisateur normal sur route admin → redirection vers home


import { redirect } from "next/navigation";

export const AUTH_ROUTES = {
    login: "/login",
    // often edit ...
    app: {
        home: "/",
        public: ["/login", "/signup", "/a3admin"],
        private: []
    },

    // edit this file when you change APP_MENUS / root links
    root: {
        home: "/a3admin/dashboard",
        public: [],
        private: [
            "/a3admin/dashboard",
            "/a3admin/user",
            /\/a3admin\/user\/[0-9]+$/,
        ]
    },
}

const { root, app } = AUTH_ROUTES

// route matcher condition
const routesMatcher = {
    isPublicRoute: (headerPathname: string) => app.public.includes(headerPathname),
    isRootPrivateRoute: (headerPathname: string) =>
        root.private.includes(headerPathname)
        || root.private.some((url) => typeof url !== "string" && url.test(headerPathname))
}

// redirection depend on matcher
export function handleAuthRedirects(isAuth: unknown, hList: { pathname: string, a3root: boolean }) {
    const pathname = hList.pathname;
    const isRoot = hList.a3root;

    const isRootRoute = routesMatcher.isRootPrivateRoute(pathname);
    if (isRoot && !isRootRoute) redirect(AUTH_ROUTES.root.home); // admin access only is route

    const isPublicRoute = routesMatcher.isPublicRoute(pathname);
    if (!isAuth && !isPublicRoute) redirect(AUTH_ROUTES.login); // user not login
    if (isAuth && isPublicRoute) redirect(AUTH_ROUTES.app.home); // user not access public route
    if (isAuth && isRootRoute && !isRoot) redirect(AUTH_ROUTES.app.home); // user not access admin route
}

