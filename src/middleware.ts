import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { type MiddlewareConfig, type NextRequest, NextResponse } from "next/server";
import { env } from "~/env.mjs";
// import { type dzinfer } from "./_lib/utils";
import { type Users, type users } from "./server/db/schema";

const secret = new TextEncoder().encode(env.KEY_APP)

export async function encrypt(payload: unknown) {
    return await new SignJWT(payload as JWTPayload | undefined | JWTPayload & typeof users)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime('1d')
        .sign(secret)
}

export async function decrypt(input: string) {
    const { payload } = await jwtVerify<JWTPayload & Users>(input, secret, { algorithms: ['HS256'] });
    return payload;
}

export const config: MiddlewareConfig = {
    matcher: [
        '/((?!api|_next/static|_next/image|images/|_next/images|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)', // negation with
    ],
}

/**
 * Middleware (demande [middleware] reponse)
 * - Entree NextRequest
 * -  Sortie : NextResponse | Response classique
 */

export async function middleware(request: NextRequest) {
    const { pathname, href, search } = request.nextUrl;
    const session = request.cookies.get("a3_sess_id")?.value;
    const sessInfo = session && (await decrypt(JSON.parse(session) as string))
    const isRoot = sessInfo && sessInfo.role === "root"

    const reqHeaders = new Headers(request.headers);
    reqHeaders.set("x-pathname", pathname);
    reqHeaders.set("x-query", search);
    reqHeaders.set("x-a3root", isRoot ? "yes" : "no");

    const response = NextResponse.next({ request: { headers: reqHeaders } });
    const publicRoutes = ["/login", "/signup", "/a3admin"]; // only public route
    const isPublicRoute = publicRoutes.includes(pathname);

    // [old code]
    !isPublicRoute && !href.includes("/manifest.webmanifest") && response.cookies.set("a3_sess_page", href, {
        expires: new Date(Date.now() + 5 * 60 * 1000), // 60 seconds => (5min) / page
    });

    return response;
}