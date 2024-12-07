import { eq } from "drizzle-orm";
import VenteDetails from "~/_components/vente-details";
import { db } from "~/server/db";
import { ventes } from "~/server/db/schema";
import { getVenteDetails } from "~/server/queries";

/**
 * Composants serveur pour plus de performance !
 * - Recuperer le contenu de la vente
 * - Recuperer les details de la vente
 */
export default async function page({ params }: { params: { id: string } }) {
  const venteDetails = await getVenteDetails(params.id);
  const venteEtat = await db.query.ventes
    .findFirst({
      where: eq(ventes.v_id, Number(params.id)),
      columns: {
        createdAt: false,
        updatedAt: false,
        v_etat: true,
        c_id: false,
      },
    })
    .then((v) => v?.v_etat);

  return (
    <VenteDetails vId={params.id} vEtat={venteEtat} paniers={venteDetails} />
  );
}
