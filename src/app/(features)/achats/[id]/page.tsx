import { eq } from "drizzle-orm";
import AchatDetails from "~/_components/achat-details";
import { db } from "~/server/db";
import { achats } from "~/server/db/schema";
import { getAchatDetails } from "~/server/queries";

/**
 * Composants serveur pour plus de performance !
 * - Recuperer le contenu de la vente
 * - Recuperer les details de la vente
 */
export default async function page({ params }: { params: { id: string } }) {
  const achatDetails = await getAchatDetails(params.id);
  const venteEtat = await db.query.achats
    .findFirst({
      where: eq(achats.a_id, Number(params.id)),
      columns: {
        createdAt: false,
        updatedAt: false,
        f_id: false,
        a_etat: true,
      },
    })
    .then((a) => a?.a_etat);

  return (
    <AchatDetails aId={params.id} aEtat={venteEtat} paniers={achatDetails} />
  );
}
