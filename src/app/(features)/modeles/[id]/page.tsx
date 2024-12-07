import {
  ArrowLeftCircleIcon,
  CpuIcon,
  DollarSign,
  Package,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Shell } from "~/_components/shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import { formatWari } from "~/_lib/utils";
import { getModeleDetails } from "~/server/queries";


export default async function page({ params }: { params: { id: string } }) {
  const modeleDetails = await getModeleDetails(params.id);
  if (!modeleDetails) return redirect("/modeles");

  return (
    <Shell variant="default">
      <Link
        href="/modeles"
        className="mb-2 mt-2 flex items-center gap-2 text-primary"
      >
        <ArrowLeftCircleIcon className="h-4 w-4" />
        Retour dans stock
      </Link>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2 p-2 pb-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Modele</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">ID: {modeleDetails.m_id}</p>
              <p className="text-sm font-semibold">{modeleDetails.m_nom}</p>
              <p className="text-xs text-gray-500">{modeleDetails.m_type}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2 p-2 pb-2">
            <Package className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Quantite</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{modeleDetails.m_qte}</div>
            <p className="text-xs text-gray-500">en stock</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2 p-2 pb-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Prix</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {formatWari(modeleDetails.m_prix, { minimumFractionDigits: 0 })} F
            </div>
            <p className="text-xs text-gray-500">par iphone</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-lg">
          <CardHeader className="flex flex-row items-center space-x-2 p-2 pb-2">
            <CpuIcon className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Memoire</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{modeleDetails.m_memoire}</div>
            <p className="text-xs text-gray-500">GB</p>
          </CardContent>
        </Card>
      </div>

      {modeleDetails.iphones && modeleDetails.iphones.length > 0 ? (
        <Table className="mt-5">
          <TableCaption>Listes des iphones du modele.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>IMEI / CODE BARE</TableHead>
              <TableHead>ETAT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modeleDetails.iphones.map((iphone) => (
              <TableRow key={iphone.i_id}>
                <TableCell className="font-medium">
                  {iphone.i_barcode}
                </TableCell>
                <TableCell>
                  {iphone.i_instock ? "Disponible" : "Indisponible"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center text-sm text-gray-500">Aucun iPhone</p>
      )}
    </Shell>
  );
}
