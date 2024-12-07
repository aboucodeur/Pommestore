import { NextResponse } from "next/server";
// import { membres } from "~/server/db/schema";

export async function GET(request: Request) {
    const search = new URL(request.url).search
    const searchParam = new URLSearchParams(search)
    const m_id = searchParam.get("photo_id") ?? "";
    if (!m_id) return Response.json("No image to load !")
    // const membre = await db.query.membres.findFirst({ where: eq(membres.m_id, parseFloat(m_id)), columns: { photo: true } })
    return NextResponse.json("Million dollars APP")
}

// const getImgPath = searchParam.get('url')?.split(env.PUBLIC_ASSETS_URL)[1] ?? ""
// const fileDir = env.NODE_ENV === "production" ? "/.next/static" : "/public/images"
// const filePath = process.cwd() + fileDir + getImgPath;
// if (!fs.existsSync(filePath)) return Response.json("Le fichier n'existe pas !");
// buffer is magic in computer science
// const getImage = fs.readFileSync(filePath).buffer
