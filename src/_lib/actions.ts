"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "~/server/db";
import {
  achats,
  acommandes,
  clients,
  fournisseurs,
  iphones,
  modeles,
  vcommandes,
  ventes,
} from "~/server/db/schema";
import { getSession } from "./sessions";
import {
  asNumber,
  guestError,
  isNumber,
  urlsParams,
  validateZodData,
} from "./utils";

// unstable_cache => cache data in session !
const zodA = z.object;

// like zod data validation
const VALIDATE_ACTIONS = {
  client: zodA({
    nom: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    tel: z
      .string()
      // .min(9, "Le numéro de téléphone doit contenir au moins 9 chiffres")
      .max(25, "Le numéro de téléphone ne peut pas dépasser 25 caractères")
      .optional()
      .nullable(),
    adr: z
      .string()
      .max(200, "L'adresse ne peut pas dépasser 200 caractères")
      .optional()
      .nullable(),
    type: z.enum(["SIM", "REV"], {
      required_error: "Le type de client est requis",
      invalid_type_error: "Type de client invalide",
    }),
  }),
  fournisseur: zodA({
    nom: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    tel: z
      .string()
      .max(25, "Le numéro de téléphone ne peut pas dépasser 25 caractères")
      .optional(),
    adr: z
      .string()
      .max(200, "L'adresse ne peut pas dépasser 200 caractères")
      .optional(),
  }),
  modele: zodA({
    nom: z
      .string()
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(60, "Le nom ne peut pas dépasser 60 caractères"),
    type: z
      .string()
      .min(2, "Le type doit contenir au moins 2 caractères")
      .max(25, "Le type ne peut pas dépasser 25 caractères"),
    classe: z.enum(["CARTONS", "ARRIVAGES"], {
      required_error: "classe invalide",
      invalid_type_error: "classe invalide",
    }),
    prix: z.coerce
      .number()
      .min(0, "Le prix doit être positif")
      .max(999999.99, "Prix trop élevé")
      .default(0),
    memoire: z.coerce
      .number()
      .min(1, "La mémoire doit être positive")
      .default(64),

    imeis: z.string().max(5000, "Liste d'IMEI trop longue").optional(),
  }),
  vente: zodA({
    date: z.union([z.string(), z.date()]).optional(),
    c_id: z.coerce.number().positive("ID client invalide"),
  }),
  achat: zodA({
    date: z.union([z.string(), z.date()]).optional(),
    f_id: z.coerce.number().positive("ID fournisseur invalide"),
  }),
};

// clients
export async function addClient(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    nom: formData.get("nom") as string,
    tel: formData.get("tel") as string,
    adr: formData.get("adr") as string,
    type: formData.get("type") as string,
  };

  const validated = validateZodData(VALIDATE_ACTIONS.client, data, formData);
  if (!validated.success) return { error: validated.error };

  try {
    await db.insert(clients).values({
      c_nom: data.nom.trim(),
      c_tel: data.tel.trim() ?? null,
      c_adr: data.adr.trim() ?? null,
      c_type: data.type,
      en_id: session.en_id,
    });

    revalidatePath("/clients");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de l'ajout du client" };
  }
}

export async function editClient(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) throw guestError;

  const data = {
    id: formData.get("id") as string,
    nom: formData.get("nom") as string,
    tel: formData.get("tel") as string,
    adr: formData.get("adr") as string,
    type: formData.get("type") as string,
  };

  if (!isNumber(data.id)) return { error: "ID client invalide" };

  const validated = validateZodData(VALIDATE_ACTIONS.client, data, formData);
  if (!validated.success) return { error: validated.error };

  try {
    await db
      .update(clients)
      .set({
        c_nom: data.nom.trim(),
        c_tel: data.tel.trim() ?? null,
        c_adr: data.adr.trim() ?? null,
        c_type: data.type,
      })
      .where(
        and(
          eq(clients.c_id, Number(data.id)),
          eq(clients.en_id, Number(session.en_id)),
        ),
      );

    revalidatePath("/clients");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la modification du client" };
  }
}

export async function deleteClient(c_id: string) {
  const session = await getSession();
  if (!session) throw guestError;

  if (!isNumber(c_id)) return { error: "ID client invalide" };

  try {
    // transform en update
    await db
      .update(clients)
      .set({ deletedAt: new Date() })
      .where(eq(clients.c_id, Number(c_id)));

    revalidatePath("/clients");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la suppression du client" };
  }
}

// fournisseurs
export async function addFournisseur(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    nom: formData.get("nom") as string,
    tel: formData.get("tel") as string,
    adr: formData.get("adr") as string,
  };

  const validated = validateZodData(
    VALIDATE_ACTIONS.fournisseur,
    data,
    formData,
  );
  if (!validated.success) return { error: validated.error };

  try {
    await db.insert(fournisseurs).values({
      f_nom: data.nom.trim(),
      f_tel: data.tel.trim() ?? null,
      f_adr: data.adr.trim() ?? null,
      en_id: session.en_id,
    });

    revalidatePath("/fournisseurs");
    return { error: "" };
  } catch (e) {
    return { error: "Erreur lors de l'ajout du fournisseur" };
  }
}

export async function editFournisseur(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    id: formData.get("id") as string,
    nom: formData.get("nom") as string,
    tel: formData.get("tel") as string,
    adr: formData.get("adr") as string,
  };

  if (!isNumber(data.id)) return { error: "ID fournisseur invalide" };

  const validated = validateZodData(
    VALIDATE_ACTIONS.fournisseur,
    data,
    formData,
  );
  if (!validated.success) return { error: validated.error };

  try {
    await db
      .update(fournisseurs)
      .set({
        f_nom: data.nom.trim(),
        f_tel: data.tel.trim() ?? null,
        f_adr: data.adr.trim() ?? null,
      })
      .where(eq(fournisseurs.f_id, Number(data.id)));

    revalidatePath("/fournisseurs");
    return { error: "" };
  } catch (e) {
    return { error: "Erreur lors de la modification du fournisseur" };
  }
}

export async function deleteFournisseur(f_id: string) {
  const session = await getSession();
  if (!session) throw guestError();

  if (!isNumber(f_id)) return { error: "ID fournisseur invalide" };

  try {
    // Soft delete
    await db
      .update(fournisseurs)
      .set({ deletedAt: new Date() })
      .where(eq(fournisseurs.f_id, Number(f_id)));

    revalidatePath("/fournisseurs");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la suppression du fournisseur" };
  }
}

// modeles
export async function addModele(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    nom: formData.get("nom") as string,
    type: formData.get("type") as string,
    prix: formData.get("prix") as string,
    memoire: formData.get("memoire") as string,
    classe: formData.get("classe") as string,
    imeis: formData.get("imeis") as string,
  };

  const validated = validateZodData(VALIDATE_ACTIONS.modele, data, formData);
  if (!validated.success) return { error: validated.error };

  try {
    await db.transaction(async (tx) => {
      // Ajout du modèle

      // find modele by name,type,memoire,classe,en_id
      const existingModele = await tx.query.modeles.findFirst({
        columns: { m_id: true },
        where: and(
          eq(modeles.m_nom, data.nom),
          eq(modeles.m_type, data.type),
          eq(modeles.m_memoire, Number(data.memoire)),
          eq(modeles.m_classe, data.classe as "CARTONS" | "ARRIVAGES"),
          eq(modeles.en_id, session.en_id),
        ),
      });

      let currentModele = null;
      if (existingModele) currentModele = existingModele;
      else {
        const [newModele] = await tx
          .insert(modeles)
          .values({
            m_nom: data.nom,
            m_qte: 0,
            m_type: data.type,
            m_prix: data.prix,
            m_memoire: Number(data.memoire),
            m_classe: data.classe as "CARTONS" | "ARRIVAGES",
            en_id: session.en_id,
          })
          .returning({ m_id: modeles.m_id });

        currentModele = newModele;
      }

      // Traitement des IMEI si présents
      if (data.imeis?.trim() && currentModele) {
        const imeiList = data.imeis
          .split(";")
          .map((imei) => imei.trim())
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index); // Suppression des doublons

        if (imeiList.length > 0) {
          // Ajout des iphones avec les IMEI
          await tx.insert(iphones).values(
            imeiList.map((imei) => ({
              i_barcode: imei,
              m_id: currentModele.m_id,
              en_id: session.en_id,
            })),
          );

          // Mise à jour de la quantité du modèle
          await tx
            .update(modeles)
            .set({ m_qte: sql`m_qte + 1` })
            .where(eq(modeles.m_id, currentModele.m_id));
        }
      }
    });

    revalidatePath("/modeles");
    return { error: "" };
  } catch (e) {
    console.log(e);
    return { error: "Erreur lors de l'ajout du modèle" };
  }
}

export async function editModele(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    id: formData.get("id") as string,
    nom: formData.get("nom") as string,
    type: formData.get("type") as string,
    prix: formData.get("prix") as string,
    memoire: formData.get("memoire") as string,
  };

  if (!isNumber(data.id)) return { error: "ID modèle invalide" };

  const validated = validateZodData(VALIDATE_ACTIONS.modele, data, formData);
  if (!validated.success) return { error: validated.error };

  try {
    await db
      .update(modeles)
      .set({
        m_nom: data.nom,
        m_type: data.type,
        m_prix: data.prix,
        m_memoire: Number(data.memoire),
      })
      .where(
        and(
          eq(modeles.m_id, Number(data.id)),
          eq(modeles.en_id, session.en_id),
        ),
      );

    revalidatePath("/modeles");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la modification du modèle" };
  }
}

export async function deleteModele(m_id: string) {
  const session = await getSession();
  if (!session) throw guestError();

  if (!isNumber(m_id)) return { error: "ID modèle invalide" };

  try {
    // await db.transaction(async (tx) => {
    //     // Suppression des iphones associés
    // await tx
    //     .delete(iphones)
    //     .where(
    //         and(
    //             eq(iphones.m_id, Number(m_id)),
    //             eq(iphones.en_id, session.en_id)
    //         )
    //     );

    // Soft delete du modèle
    await db
      .update(modeles)
      .set({ deletedAt: new Date() })
      .where(
        and(eq(modeles.m_id, Number(m_id)), eq(modeles.en_id, session.en_id)),
      );
    // });

    revalidatePath("/modeles");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la suppression du modèle" };
  }
}

export async function restoreModele(m_id: string) {
  try {
    const session = await getSession();
    if (!session) throw guestError();

    if (!isNumber(m_id)) return { error: "ID modèle invalide" };

    // Soft delete du modèle
    await db
      .update(modeles)
      .set({ deletedAt: null })
      .where(
        and(eq(modeles.m_id, Number(m_id)), eq(modeles.en_id, session.en_id)),
      );
    revalidatePath("/modeles");
    return { error: "" };
  } catch {
    return { error: "Erreur lors de la restauration du modèle" };
  }
}

// ventes
export async function addVente(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    date: formData.get("date") as string,
    c_id: formData.get("c_id") as string,
  };

  const validated = validateZodData(VALIDATE_ACTIONS.vente, data, formData);
  if (!validated.success) return { error: validated.error };

  // try {
  const [inserted] = await db
    .insert(ventes)
    .values({
      v_date: data.date ? new Date(data.date) : undefined,
      c_id: Number(data.c_id),
      en_id: session.en_id,
    })
    .returning({
      v_id: ventes.v_id,
      v_date: ventes.v_date,
    });

  const client = await db
    .select({ c_nom: clients.c_nom })
    .from(clients)
    .where(eq(clients.c_id, Number(data.c_id)))
    .then((r) => r[0]);

  const params = urlsParams({ ...inserted, ...client }, true, {
    v_id: "id",
    v_date: "date",
  });

  redirect(`/ventes/${inserted?.v_id}${params}&show=1`);
}

export async function editVente(_prevState: unknown, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return guestError();

    const data = {
      id: formData.get("id") as string,
      date: formData.get("date") as string,
      c_id: formData.get("c_id") as string,
    };

    if (!isNumber(data.id)) return { error: "ID vente invalide" };
    const validated = validateZodData(VALIDATE_ACTIONS.vente, data, formData);
    if (!validated.success) return { error: validated.error };

    await db
      .update(ventes)
      .set({
        v_date: data.date ? new Date(data.date) : undefined,
        c_id: Number(data.c_id),
      })
      .where(eq(ventes.v_id, Number(data.id)));

    revalidatePath("/ventes");
    return { error: "" };
  } catch (e) {
    return { error: "Erreur lors de la modification de la vente" };
  }
}

export async function deleteVente(v_id: string) {
  try {
    const session = await getSession();
    if (!session) throw guestError();

    if (!isNumber(v_id)) return { error: "ID vente invalide" };

    // verfier si la vente a des commandes
    const vcommande = await db.query.vcommandes.findMany({
      where: eq(vcommandes.v_id, Number(v_id)),
    });

    if (vcommande.length > 0)
      return { error: "Impossible de supprimer une vente avec des commandes" };

    await db.delete(ventes).where(eq(ventes.v_id, Number(v_id)));
    revalidatePath("/ventes");
    return { error: "" };
  } catch (error) {
    return { error: "Erreur lors de la suppression de la vente" };
  }
}

// ajouter une commande de vente
export async function addCommandeVente(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return guestError();

    const data = {
      v_id: formData.get("v_id") as string, // id de la vente
      barcode: formData.get("barcode") as string,
      prix: asNumber(formData.get("prix") as string),
    };

    /**
     * Ses conditions :
     * 1. Ne pas ajouter une commande si la vente est valider
     * 2. Iphone ne doit pas etre supprimer
     * 3. Iphone doit etre disponble en stock
     * 4. Prix n'est pas obligatoire
     * 5. souvent l'iphone peut se repeter d'imei mais de modele different
     *    donc guider l'utilisateurs avec un message d'erreur si c'est le cas
     */

    // chercher l'iphone via son code IMEI pour l'entreprise donnee
    const getIphonesQuery = await db.query.iphones
      .findMany({
        where: (iphones, { eq }) =>
          eq(iphones.i_barcode, data.barcode.split("#")[0] ?? data.barcode),
        with: { modele: true },
      })
      .then((res) => res.filter((d) => d.modele.en_id === session.en_id));

    let getIphones = null; // default chose first
    const checkUserChoice = data.barcode.split("#")[1]?.trim();
    if (getIphonesQuery.length > 1 && !checkUserChoice)
      return {
        error: getIphonesQuery
          .map(
            (iph, _idx) =>
              `#${_idx + 1} => (${iph.modele.m_nom}) - ${iph.modele.m_type} - ${iph.modele.m_memoire} Go - ${iph.modele.m_classe} `,
          )
          .join("<br>"),
      };

    // is my tricks to guide user to choise iphone if is imei is repeated
    if (!isNumber(checkUserChoice!) && data.barcode.includes("#"))
      return { error: "Veuillez choisir l'iphone par #" };

    getIphones = checkUserChoice
      ? getIphonesQuery[Number(checkUserChoice) - 1]
      : getIphonesQuery[0];

    if (!getIphones) return { error: "IMEI introuvable" };
    if (getIphones.modele.deletedAt) return { error: "Iphone supprimé" };
    if (getIphones.i_instock !== 1) return { error: "Iphone hors stock" };

    // transactions : Pour eviter les erreurs lier les informations
    await db.transaction(async (tx) => {
      // inserer l'iphone dans la commande
      await tx.insert(vcommandes).values({
        v_id: Number(data.v_id),
        i_id: getIphones.i_id,
        vc_prix: data.prix.toString(),
        vc_etat: 0,
        vc_qte: "1",
      });

      // marquer comme non disponible => pour eviter la creation de plusieurs commande incoherentes (tres important !)
      await tx
        .update(iphones)
        .set({
          i_instock: 0,
        })
        .where(eq(iphones.i_id, getIphones.i_id));
    });

    revalidatePath(`/ventes/${data.v_id}`);
    return { error: "" };
  } catch {
    return { error: "Erreur lors de l'ajout de l'iphone" };
  }
}

// modifier la commande de vente
export async function editCommandeVente(vc_id: string) {
  try {
    const session = await getSession();
    if (!session) return guestError();
    if (!isNumber(vc_id)) return { error: "ID commande vente invalide" };

    /**
     * Ses conditions
     * 1. Verifier si la commande est deja rendu
     * 2. Verifier si la commande est introuvable
     *
     * Si ok =>
     * 1. marquer comme rendu vc_etat = 2
     * 2. marquer comme disponible en stock i_instock = 1
     * 3. mettre a jour le stock de l'iphone en sttock
     */

    const vcommande = await db.query.vcommandes.findFirst({
      where: eq(vcommandes.vc_id, Number(vc_id)),
      with: {
        iphone: {
          with: {
            modele: true,
          },
        },
      },
    });

    if (!vcommande || vcommande.vc_etat > 1)
      return { error: "Commande deja rendu ou commande introuvable" };

    await db.transaction(async (tx) => {
      // marquer comme rendu
      await tx
        .update(vcommandes)
        .set({ vc_etat: 2 })
        .where(eq(vcommandes.vc_id, Number(vc_id)))
        .returning({ i_id: vcommandes.i_id });

      // marquer commde disponible
      await tx
        .update(iphones)
        .set({ i_instock: 1 })
        .where(eq(iphones.i_id, vcommande.iphone.i_id));

      // mettre a jour le stock du modele de l'iphone
      await tx
        .update(modeles)
        .set({ m_qte: vcommande.iphone.modele.m_qte + 1 })
        .where(eq(modeles.m_id, vcommande.iphone.modele.m_id));
    });

    revalidatePath(`/ventes/${vcommande.v_id}`);
    return { error: "" };
  } catch (e) {
    return { error: "Erreur lors de la modification de la commande de vente" };
  }
}

// Supprimer la commande d'iphone
export async function deleteCommandeVente(vc_id: string) {
  const session = await getSession();
  if (!session) return guestError();
  if (!isNumber(vc_id)) return { error: "ID commande vente invalide" };

  const findCommande = await db.query.vcommandes.findFirst({
    where: (vcommandes, { eq }) => eq(vcommandes.vc_id, Number(vc_id)),
    with: { iphone: true },
  });

  if (!findCommande) return { error: "Commande introuvable" };

  await db.transaction(async (tx) => {
    // marquer disponible en stock
    await tx
      .update(iphones)
      .set({ i_instock: 1 })
      .where(eq(iphones.i_id, findCommande.iphone.i_id));
    // supprimer la commande
    await tx.delete(vcommandes).where(eq(vcommandes.vc_id, Number(vc_id)));
  });

  revalidatePath(`/ventes/${findCommande.v_id}`);
  return { error: "" };
}

// valider les commandes de la ventes
export async function validateCommandeVente(v_id: string) {
  const session = await getSession();
  if (!session) return guestError();

  /**
   * Ses conditions :
   * 1. Ne pas valider si la vente est deja valider
   */

  const vendre = await db.query.ventes.findFirst({
    where: eq(ventes.v_id, Number(v_id)),
    with: {
      vcommandes: {
        with: {
          iphone: {
            with: {
              modele: true,
            },
          },
        },
      },
    },
  });

  if (!vendre || vendre.vcommandes.length === 0)
    return { error: "Pannier vide pas la peine de valider" };

  if (vendre.v_etat > 0) return { error: "Vente deja valider" };

  await db.transaction(async (tx) => {
    await tx
      .update(ventes)
      .set({ v_etat: 1 })
      .where(eq(ventes.v_id, Number(v_id)));

    for (const vc of vendre.vcommandes) {
      // marquer comme valider
      await tx
        .update(vcommandes)
        .set({ vc_etat: 1 })
        .where(eq(vcommandes.vc_id, vc.vc_id));
      // dimunier le stock de l'iphone
      await tx
        .update(modeles)
        .set({ m_qte: vc.iphone.modele.m_qte - 1 })
        .where(eq(modeles.m_id, vc.iphone.modele.m_id));
    }
  });

  revalidatePath("/ventes");
  return { error: "" };
}

// achats
export async function addAchat(_prevState: unknown, formData: FormData) {
  const session = await getSession();
  if (!session) return guestError();

  const data = {
    date: formData.get("date") as string,
    f_id: formData.get("f_id") as string,
  };

  const validated = validateZodData(VALIDATE_ACTIONS.achat, data, formData);
  if (!validated.success) return { error: validated.error };

  const [inserted] = await db
    .insert(achats)
    .values({
      a_date: data.date ? new Date(data.date) : undefined,
      f_id: Number(data.f_id),
      en_id: session.en_id,
    })
    .returning({
      a_id: achats.a_id,
      a_date: achats.a_date,
    });

  const fournisseur = await db
    .select({ f_nom: fournisseurs.f_nom })
    .from(fournisseurs)
    .where(eq(fournisseurs.f_id, Number(data.f_id)))
    .then((r) => r[0]);

  const params = urlsParams({ ...inserted, ...fournisseur }, true, {
    a_id: "id",
    a_date: "date",
  });

  redirect(`/achats/${inserted?.a_id}${params}&show=1`);
}

export async function editAchat(_prevState: unknown, formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return guestError();

    const data = {
      id: formData.get("id") as string,
      date: formData.get("date") as string,
      f_id: formData.get("f_id") as string,
    };

    if (!isNumber(data.id)) return { error: "ID achat invalide" };
    const validated = validateZodData(VALIDATE_ACTIONS.achat, data, formData);
    if (!validated.success) return { error: validated.error };

    await db
      .update(achats)
      .set({
        a_date: data.date ? new Date(data.date) : undefined,
        f_id: Number(data.f_id),
      })
      .where(eq(achats.a_id, Number(data.id)));

    revalidatePath("/achats");
    return { error: "" };
  } catch {
    return { error: "Erreur lors de la modification de l'achat" };
  }
}

export async function deleteAchat(a_id: string) {
  try {
    const session = await getSession();
    if (!session) throw guestError();
    if (!isNumber(a_id)) return { error: "ID achat invalide" };

    // verfier si l'achat a des commandes
    const acommande = await db.query.acommandes.findMany({
      where: eq(acommandes.a_id, Number(a_id)),
    });

    if (acommande.length > 0)
      return { error: "Impossible de supprimer l'achat avec des commandes" };

    await db.delete(achats).where(eq(achats.a_id, Number(a_id)));
    revalidatePath("/achats");
    return { error: "" };
  } catch {
    return { error: "Erreur lors de la suppression de l'achat" };
  }
}

export async function addCommandeAchat(formData: FormData) {
  try {
    const session = await getSession();
    if (!session) return guestError();

    const data = {
      m_id: formData.get("m_id") as string,
      barcode: formData.get("barcode") as string,
      prix: formData.get("prix") as string,
      a_id: formData.get("a_id") as string,
    };

    if (!isNumber(data.m_id) || !isNumber(data.a_id))
      return { error: "ID modèle ou achat invalide" };

    await db.transaction(async (tx) => {
      // creer l'iphone
      const [iphone] = await tx
        .insert(iphones)
        .values({
          i_barcode: data.barcode,
          m_id: Number(data.m_id),
          i_instock: 0,
        })
        .returning({ i_id: iphones.i_id });

      // ajouter a la commande d'achat
      if (iphone) {
        await tx
          .insert(acommandes)
          .values({
            a_id: Number(data.a_id),
            i_id: iphone.i_id,
            ac_prix: data.prix,
            ac_etat: 0, // En cours
          })
          .returning();
      }
    });

    revalidatePath(`/achats/${data.a_id}`);
    return { error: "" };
  } catch {
    return { error: "Erreur lors de l'ajout de la commande d'achat" };
  }
}

export async function deleteCommandeAchat(ac_id: string) {
  try {
    const session = await getSession();
    if (!session) return guestError();
    if (!isNumber(ac_id)) return { error: "ID de commande invalide" };

    const findCommande = await db.query.acommandes.findFirst({
      where: (acommandes, { eq }) => eq(acommandes.ac_id, Number(ac_id)),
      with: { iphone: true },
    });

    if (!findCommande) return { error: "Commande introuvable" };

    await db.transaction(async (tx) => {
      // Supprimer l'iphone de la commande
      await tx.delete(acommandes).where(eq(acommandes.ac_id, Number(ac_id)));
      // Supprimer l'iphone
      await tx.delete(iphones).where(eq(iphones.i_id, findCommande.i_id));
    });

    revalidatePath(`/achats/${findCommande.a_id}`);
    return { error: "" };
  } catch {
    return { error: "Erreur lors de la suppression de la commande d'achat" };
  }
}

export async function validateCommandeAchat(a_id: string) {
  try {
    const session = await getSession();
    if (!session) return guestError();
    if (!isNumber(a_id)) return { error: "ID d'achat invalide" };

    const achat = await db.query.achats.findFirst({
      where: eq(achats.a_id, Number(a_id)),
      with: {
        acommandes: {
          with: {
            iphone: {
              with: {
                modele: true,
              },
            },
          },
        },
      },
    });

    if (!achat || achat.acommandes.length === 0)
      return { error: "Pannier vide pas la peine de valider" };
    if (achat.a_etat > 0) return { error: "Achat deja valider" };

    await db.transaction(async (tx) => {
      // valider l'achat
      await tx
        .update(achats)
        .set({ a_etat: 1 })
        .where(eq(achats.a_id, Number(a_id)));

      // Mettre à jour l'état des iphones et la quantité des modèles
      for (const commande of achat.acommandes) {
        // valider la commande d'achat
        await tx
          .update(acommandes)
          .set({ ac_etat: 1 }) // Validé
          .where(eq(acommandes.ac_id, commande.ac_id));

        // Rendre disponible l'iphone
        await tx
          .update(iphones)
          .set({ i_instock: 1 })
          .where(eq(iphones.i_id, commande.i_id));

        // Mettre à jour la quantité du modele
        await tx
          .update(modeles)
          .set({ m_qte: commande.iphone.modele.m_qte + 1 })
          .where(eq(modeles.m_id, commande.iphone.modele.m_id));
      }

      revalidatePath(`/achats/${a_id}`);
    });

    return { error: "" };
  } catch {
    return { error: "Erreur lors de la validation de la commande d'achat" };
  }
}

// ----> USER FEEDBACK

// Retours grouper des iphones !
export async function addRetour(codes: (string | undefined)[]) {
  const session = await getSession();
  if (!session) return guestError();

  const ids = codes;

  if (!ids || ids.length < 1) return { error: "IMEI invalide" };

  try {
    return await db.transaction(async (tx) => {
      // 1) chercher le client => RETOURS
      const client = await tx.query.clients.findFirst({
        where: and(
          eq(clients.c_nom, "RETOURS"),
          eq(clients.en_id, session.en_id),
        ),
      });
      if (!client)
        return {
          error: "Retours non configuré veuillez ajouter le client RETOURS",
        };

      //2) Créer la vente
      const [newVente] = await tx
        .insert(ventes)
        .values({
          c_id: client.c_id,
          en_id: session.en_id,
          v_etat: 1, // valider la vente
        })
        .returning({
          v_id: ventes.v_id,
          v_date: ventes.v_date,
        });

      //3) Ajouter les iphones a la commande
      if (newVente)
        await tx.insert(vcommandes).values(
          ids.map((ip_id) => ({
            v_id: newVente.v_id,
            i_id: Number(ip_id),
            vc_etat: 1, // valider la commande
          })),
        );

      //4) Mise a jour du stock
      for (const ip_id of ids) {
        await tx
          .update(iphones)
          .set({ i_instock: 0 })
          .where(eq(iphones.i_id, Number(ip_id)));

        const iphone = await tx.query.iphones.findFirst({
          where: eq(iphones.i_id, Number(ip_id)),
          with: {
            modele: {
              columns: {
                m_id: true,
                m_qte: true,
              },
            },
          },
        });

        if (iphone)
          await tx
            .update(modeles)
            .set({ m_qte: iphone.modele.m_qte - 1 })
            .where(eq(modeles.m_id, iphone.modele.m_id));
      }

      revalidatePath("/retours");
      revalidatePath("/");
      return { error: "" };
    });
  } catch (e) {
    return { error: "Erreur lors du sorties grouper !" };
  }
}
