"use server";

import { eq } from "drizzle-orm";
import { type JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";

const sessConfig = {
  name: "a3_sess_id",
  page: "",
  expires: 60 * 60 * 1000, // 1d
  secure: env.NODE_ENV === "production" ? true : false,
};
const secret = new TextEncoder().encode(env.KEY_APP);

export async function encrypt(payload: unknown) {
  return await new SignJWT(
    payload as JWTPayload | undefined | (JWTPayload & typeof users),
  )
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}
export async function decrypt(input: string) {
  const { payload } = await jwtVerify<JWTPayload & typeof users.$inferSelect>(
    input,
    secret,
    { algorithms: ["HS256"] },
  );
  return payload;
}

// ! redirect () not work in simple try/catch like throw
export async function signIn(state: { error: unknown }, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  if (!username || !password) return { error: "Champs invalide !" };

  const user = await db
    .select()
    .from(users)
    .where(eq(users.name, username))
    .then((user) => user[0]);
  if (!user) return { error: "Nom d'utilisateur ou mot de passe incorrect !" };
  const checkPass = user.password === password;
  if (!checkPass)
    return { error: "Nom d'utilisateur ou mot de passe incorrect !" };

  /**
   * encode user data in jwt
   * like session and database !
   * Each session is unique
   */
  const token = await encrypt(user); // encrypt user information !
  const { name, secure, expires, page } = sessConfig;

  // store token in database
  await db.insert(sessions).values({
    sessionToken: token,
    expires: new Date(Date.now() + expires),
    userId: user.id,
  });

  // store token in cookie
  cookies().set(name, JSON.stringify(token), {
    httpOnly: secure,
    expires: new Date(Date.now() + expires),
  });

  redirect(
    user.role === "root"
      ? "/a3admin/dashboard"
      : (cookies().get(page)?.value ?? "/"),
  );
}

export async function signOut() {
  const session = cookies().get(sessConfig.name)?.value; // is encrypted
  if (session) {
    const user = await decrypt(JSON.parse(session) as string);
    await db.delete(sessions).where(eq(sessions.userId, user.id));
    cookies().delete(sessConfig.name);
    cookies().delete("a3_sess_page"); // save user last visited page
    redirect("/login");
  }
}

// ! fix session : get session data in db [ok]
export async function getSession() {
  const session = cookies().get(sessConfig.name)?.value;
  if (!session) return false;

  const verif = await verifSession(JSON.parse(session) as string);
  if (!verif) return false; // return false not redirect (think like a api )

  const getId = (await decrypt(JSON.parse(session) as string)).id;
  const user = await db.query.users.findFirst({
    where: eq(users.id, getId),
  }); // hot updated user info
  if (!user) return false;
  return user;
}

async function verifSession(session: string) {
  const getSession = await db.query.sessions.findFirst({
    where: eq(sessions.sessionToken, session),
  });
  if (!getSession || new Date() > new Date(getSession.expires)) return false;
  return true;
}

// export async function guestError(
//     message?: string,
//     rest?: Record<string, unknown>
// ) {
//     return { error: message ?? "Vous devez être connecté !", ...rest }
// }
