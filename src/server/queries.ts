"use server";

import { and, asc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { getSession } from "~/_lib/sessions";
import { unstable_cache } from "~/_lib/unstable-cache";
import { guestError, takeXata } from "~/_lib/utils";
import { db } from "~/server/db";
import {
  achats,
  clients,
  fournisseurs,
  iphones,
  modeles,
  ventes,
} from "~/server/db/schema";

// recuperation des clients
export async function getClients() {
  const session = await getSession();
  if (!session) return [];

  return unstable_cache(
    async () => {
      const getAll = await db.query.clients.findMany({
        where: and(
          eq(clients.en_id, Number(session.en_id)),
          isNull(clients.deletedAt),
        ),
        orderBy: [asc(clients.c_nom)],
      });

      return takeXata(getAll, "many");
    },
    ["clients"],
    { revalidate: 60 },
  )();
}

// recuperation des fournisseurs
export async function getFournisseurs() {
  const session = await getSession();
  if (!session) return [];

  return unstable_cache(
    async () => {
      const getAll = await db.query.fournisseurs.findMany({
        where: and(
          eq(fournisseurs.en_id, Number(session.en_id)),
          isNull(fournisseurs.deletedAt),
        ),
        orderBy: [asc(fournisseurs.f_nom)],
      });

      return takeXata(getAll, "many");
    },
    ["fournisseurs"],
    { revalidate: 60 },
  )();
}

// recuperation des modeles et leurs details
export async function getModeles(filter: string) {
  const session = await getSession();
  if (!session) return [];

  return unstable_cache(
    async () => {
      const getAll = await db.query.modeles.findMany({
        where: and(
          eq(modeles.en_id, Number(session.en_id)),
          filter === "all" || !filter
            ? isNull(modeles.deletedAt)
            : isNotNull(modeles.deletedAt),
        ),
        orderBy: [asc(modeles.m_nom), asc(modeles.createdAt)],
      });

      return takeXata(getAll, "many");
    },
    ["modeles"],
    { revalidate: 60 },
  )();
}

// cache it
export async function getModeleDetails(m_id: string) {
  const session = await getSession();
  if (!session) return;

  // cache it with m_id a key
  const key = `modeles-${m_id}`;

  return unstable_cache(
    async () => {
      const modele = await db.query.modeles.findFirst({
        where: and(
          eq(modeles.m_id, Number(m_id)),
          eq(modeles.en_id, session.en_id),
          isNull(modeles.deletedAt),
        ),
        with: {
          iphones: {
            orderBy: [asc(iphones.i_barcode)],
          },
        },
      }); // findFirst take only one result

      return takeXata(modele, "many"); // takeXata take many but findFirst take only one
    },
    [key],
    { revalidate: 60 },
  )();
}

// recuperation des ventes
export async function getVentes() {
  const session = await getSession();
  if (!session) return [];

  const getAll = await db.query.ventes.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    with: {
      client: {
        columns: {
          c_nom: true,
        },
      },
    },
    where: eq(ventes.en_id, Number(session.en_id)),
    orderBy: [asc(ventes.v_date)],
  });

  return takeXata(getAll, "many");
}

// recuperations des commandes de la vente
export async function getVenteDetails(v_id: string) {
  const session = await getSession();
  if (!session) return;

  const commandes = await db.query.vcommandes.findMany({
    where: (vcommandes, { eq }) => eq(vcommandes.v_id, Number(v_id)),
    with: {
      iphone: {
        columns: {
          i_barcode: true,
        },
        with: {
          modele: {
            columns: {
              m_nom: true,
              m_type: true,
              m_memoire: true,
            },
          },
        },
      },
    },
  });

  return takeXata(commandes, "many");
}

// recuperation des achats
export async function getAchats() {
  const session = await getSession();
  if (!session) return [];

  const getAll = await db.query.achats.findMany({
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    with: {
      fournisseur: {
        columns: {
          f_nom: true,
        },
      },
    },
    where: eq(achats.en_id, Number(session.en_id)),
    orderBy: [asc(achats.a_date)],
  });

  return takeXata(getAll, "many");
}

// recuperations des commandes de l'achat
export async function getAchatDetails(a_id: string) {
  const session = await getSession();
  if (!session) return;

  const commandes = await db.query.acommandes.findMany({
    where: (acommandes, { eq }) => eq(acommandes.a_id, Number(a_id)),
    with: {
      iphone: {
        columns: {
          i_barcode: true,
        },
        with: {
          modele: {
            columns: {
              m_nom: true,
              m_type: true,
              m_memoire: true,
            },
          },
        },
      },
    },
  });

  return takeXata(commandes, "many");
}

// recherche gloabales sur les iphones
export async function getIphonesInfos(barcode: string) {
  const session = await getSession();
  if (!session) return [];

  const getIphones = await db.query.iphones
    .findMany({
      where: (iphones, { eq }) => eq(iphones.i_barcode, barcode),
      with: {
        modele: {
          columns: {
            m_nom: true,
            m_type: true,
            m_memoire: true,
            en_id: true,
          },
        }, // modele de l'iphone
        vcommandes: {
          // commandes de l'iphone
          columns: {
            vc_etat: true,
            createdAt: true,
          },
          with: {
            vente: {
              // dans quelle ventes
              with: {
                client: {
                  // quelle client
                  columns: {
                    c_nom: true,
                  },
                },
              },
            },
          },
        },
      }, // avec les modeles et commandes
    })
    .then((res) => res.filter((d) => d.modele.en_id === session.en_id));

  return takeXata(getIphones, "many");
}

// Tableaux de bord de l'application

export type DashboardType = {
  qNbIphones: string;
  qNbRetours: string;
  qNbClients: string;
  qNbVentes: string;
  qTopModeles: { nom: string; total_ventes: string }[];
};

export async function getDashboard() {
  const session = await getSession();
  if (!session) return guestError();

  /**
   * Requetes : sa concerne
   * - Nombre d'iphones en stock en fonction de l'entreprise => somme modele.m_qte
   * - Nombre de retours en fonction de l'entreprise => somme vcommandes.vc_etat = 2
   * - Nombre de clients en fonction de l'entreprise => somme clients
   * - Nombre de ventes en fonction de l'entreprise => compter vente dont v_etat = 1
   *
   * - Graphes :
   *    Top 10 des modeles le plus vendus
   */

  const enId = session.en_id;
  const queries = {
    qNbIphones: `SELECT coalesce(SUM(m_qte), 0) nb_stocks
                  FROM modeles 
                  WHERE en_id = ${enId} and deleted_at IS NULL`,

    qNbRetours: `SELECT COUNT(vcommandes.vc_etat) nb_rets
                  FROM vcommandes 
                  WHERE vcommandes.vc_etat = 2 
                  and vcommandes.deleted_at IS NULL
                  and v_id IN (
                      SELECT v_id 
                      FROM ventes 
                      WHERE 
                      en_id = ${enId} 
                      and v_etat = 1
                  )`,

    qNbClients: `SELECT COUNT(clients) nb_clients
                  FROM clients 
                  WHERE en_id = ${enId} and deleted_at IS NULL`,

    qNbVentes: `SELECT COUNT(ventes) nb_ventes
                  FROM ventes 
                  WHERE en_id = ${enId} and v_etat = 1`,

    qTopModeles: `SELECT m_nom  nom, COUNT(*) as total_ventes
                   FROM vcommandes AS v
                   JOIN iphones USING(i_id)
                   JOIN modeles USING(m_id)
                   WHERE modeles.en_id = ${enId}
                   AND v.vc_etat = 1
                   GROUP BY nom
                   ORDER BY total_ventes DESC
                   LIMIT 10`,
  };

  // Tableaux de bord de l'application
  return unstable_cache(
    async () => {
      const allQueries = (await Promise.all([
        db.execute(sql.raw(queries.qNbIphones)),
        db.execute(sql.raw(queries.qNbRetours)),
        db.execute(sql.raw(queries.qNbClients)),
        db.execute(sql.raw(queries.qNbVentes)),
        db.execute(sql.raw(queries.qTopModeles)),
      ])) as unknown as [
        { nb_stocks: string },
        { nb_rets: string },
        { nb_clients: string },
        { nb_ventes: string },
        { nom: string; total_ventes: string }[],
      ];

      const datas: Record<string, unknown> = {
        qNbIphones: takeXata(allQueries[0], "one")?.nb_stocks,
        qNbRetours: takeXata(allQueries[1], "one")?.nb_rets,
        qNbClients: takeXata(allQueries[2], "one")?.nb_clients,
        qNbVentes: takeXata(allQueries[3], "one")?.nb_ventes,
        qTopModeles: takeXata(allQueries[4], "many"),
      };

      return datas as unknown as DashboardType;
    },
    ["dashboard"],
    { revalidate: 300 },
  )();
}
