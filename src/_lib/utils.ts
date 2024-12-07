import { clsx, type ClassValue } from "clsx";
import { customType } from "drizzle-orm/pg-core";
import { env } from "process";
import { twMerge } from "tailwind-merge";
import { type ZodFormattedError, type ZodSchema } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (...args: unk[]) => fetch(...args).then(res => res.json())


export const formatWari = (value: number | string = 0, options?: Intl.NumberFormatOptions) => {
  const getLng = 'fr' // like intl
  const formatter = new Intl.NumberFormat(getLng, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
    ...options
  })
  return formatter.format(typeof value === "string" ? Number(value) : value)
}

// export type dzinfer<T extends PgTable> = InferSelectModel<T>;
export type dzrelations<M, T> = M & {
  [X in keyof T]: T[X]
}
export type unk = unknown

export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// compact formatter => eg : 1M
export function compactNumber(x: number) {
  const units = ["", "K", "M", "B", "T"];
  let index = 0;
  while (x >= 1000 && index < units.length - 1) {
    x /= 1000;
    index++;
  }
  return `${x.toFixed(1)}${units[index]}`;
}

/**
 * Gestion des erreurs avec zod 
 * Pousser l'utilisateur a corriger un par un les erreurs
 * Au lieux de les afficher tous en une seule fenetre.
*/
export function validateZodData<T>(schema: ZodSchema<T>, data: unknown, formData: FormData) {
  const result = schema.safeParse(data);
  if (!result.success) {
    let error = "";
    let errKey = "";
    const keys = [...formData.keys()]; // get fields for unvalidatedDatas
    if (env.NODE_ENV === "development") {
      console.log("ZODACTIONS>SCHEMA_KEYS   : ", schema?._cached?.keys)
      console.log("ZODACTIONS>FORMDATA_KEYS : ", [...formData.keys()])
    }
    // deals with formData keys and zod schema
    for (const k of keys) {
      // ! fix typescript typing bugs
      const getErrors = result.error.format() as ZodFormattedError<Record<string, string>, string>;
      const formattedErrors = getErrors[k]?._errors;
      if (formattedErrors) {
        error = formattedErrors.join("\n");
        errKey = ""; // lastest key // k
      }
    }
    return { success: false, error: errKey + " " + error };
  }
  return { success: true, error: "" };
}

// DATABASE UTILITIES

/**
 * Fonctions utilitaires de la base de donnees
 * @see https://drizzle-orm.tanstack.com/guides/core/custom-types
 */

export const customLongBlob = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
})

/**
 * Refactoring finale sur takeXata
 * Plus simple maintenant tout depend du serveur
 * Ne pas mentir a typescript et faciliter le scaling !
 */
export function takeXata<T>(items: T, type: "one" | "many")  {
  const datas = items as Record<string, Array<unknown>>;
  if ("rows" in datas) { // like xata orm
    if (type === "one") return datas?.rows[0] as T
    return datas.rows as T
  }
  return type === "many" ? datas as T : datas[0] as T
}


/**
 * Parser un objet en url params
 */
export function urlsParams<O>(obj: O, q = false, aliases: Record<string, string> = {}): string {
  const str = [] as string[];
  for (const key in obj) {
    const alias = aliases[key] ?? key;
    if (obj[key] === undefined) continue
    if (obj[key] === null) continue
    switch (typeof obj[key]) {
      case 'string':
      case 'number':
        str[str.length] = alias + '=' + obj[key];
        break;
      case 'object':
        if (obj[key] instanceof Date) {
          str[str.length] = alias + '=' + obj[key].toISOString();
        } else {
          str[str.length] = urlsParams(obj[key], false, aliases); // not add query
        }
    }
  }
  return (q === true ? '?' : '') + str.join("&").replaceAll('+', '%20');
}


/**
 * Formattage des dates et l'heure
 */
export function formatDateTime(value: Date | string | number, options?: { format?: string }): string {
  const date = new Date(value);
  const format = options?.format ?? 'YYYY-MM-DDTHH:mm'; // default format template 

  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hour)
    .replace('mm', minute);
}

// session prepare message
export function guestError(
  message?: string,
  rest?: Record<string, unknown>
) {
  return { error: message ?? "Vous devez être connecté !", ...rest }
}

// easier number parsing and string checkup
export function asNumber(num: string) {
  const parsed = parseInt(num, 10)
  if (isNaN(parsed)) return 0
  return parseFloat(num)
}

// verif is some string is a number
export function isNumber(num: string) {
  const parsed = parseInt(num, 10)
  if (isNaN(parsed)) return false
  return parseFloat(num)
}