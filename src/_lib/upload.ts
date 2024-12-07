"use server"

import fs from "fs";
import { revalidatePath } from "next/cache";
import path from "path";
import { pipeline, type PipelineSource } from "stream";
import { promisify } from "util";
import { env } from "~/env.mjs";

const pump = promisify(pipeline);

/**
 * Fonctions pour gerer l'upload de fichier sur le serveur
 * - EN production : Externaliser avec uploadThing
 * - EN develop : Stocker les fichiers sur le serveur
 * - Stocker le fichier
 * - Supprimer le fichier
 */

type FILES = "image/png" | "image/jpg" | "image/jpeg";
type FILES_TYPE = ["image/png", "image/jpg", "image/jpeg"];

const MIMES_TYPES: FILES_TYPE = ["image/png", "image/jpg", "image/jpeg"];

const isProd = env.NODE_ENV === "production"
const MAX_SIZE = env.MAX_SIZE;
const FILE_DIR = isProd ? path.resolve('.next', 'static') : env.PUBLIC_ASSETS_DIR // prevent vercel
const FILE_URL = env.PUBLIC_ASSETS_URL

function generateFileName(filename: string) {
    const [name, ext] = filename.split(".") as [string, string]
    const id = Date.now()
    return `${name.trim().replaceAll(" ", "_")}_${id}.${ext}`
}

export async function uploadFile(file: File) {
    const infos = { error: "", uploaded: false, name: "" }

    if (!file) infos.error = "Fichier introuvable"
    const fileName = generateFileName(file.name)
    infos.name = `${FILE_URL}/${fileName}` // ! for db not for write

    const getFileType = MIMES_TYPES.includes(file.type as FILES) // valid file type
    const canFileUpload = (file.size / 1024) <= parseInt(MAX_SIZE, 10); // valid file size

    if (!getFileType || !canFileUpload) infos.error = "Veuillez choisir une image !"

    else await pump((file.stream() as unknown as PipelineSource<unknown>), fs.createWriteStream(`${FILE_DIR}/${fileName}`, "utf8"));
    infos.uploaded = true

    // apres uploader revalider le cache !
    revalidatePath("/")
    return infos
}

export async function deleteFile(fileName: string) {
    if (fileName) {
        fs.unlink(FILE_DIR + "/" + fileName, (err) => {
            return err
        })
        revalidatePath("/")
    }
}