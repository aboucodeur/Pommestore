"use client";

import {
  Barcode,
  DollarSign,
  RotateCcw,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "~/_components/ui/badge";
import { Button } from "~/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/_components/ui/card";
import { Input } from "~/_components/ui/input";
import { Separator } from "~/_components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/_components/ui/table";
import {
  addCommandeVente,
  deleteCommandeVente,
  editCommandeVente,
  validateCommandeVente,
} from "~/_lib/actions";
import { formatDateTime } from "~/_lib/utils";
import { toast } from "~/hooks/use-toast";
import { SubmitBtn } from "./modal-form/btn-pending";

type VenteDetailsProps = {
  vId: string;
  vEtat?: number;
  paniers:
    | {
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        i_id: number;
        v_id: number;
        vc_id: number;
        vc_etat: number;
        vc_qte: string;
        vc_prix: string;
        iphone: {
          i_barcode: string;
          modele: {
            m_nom: string;
            m_type: string;
            m_memoire: number;
            m_classe: string;
          };
        };
      }[]
    | undefined;
};

export default function VenteDetails(props: VenteDetailsProps) {
  const search = useSearchParams();
  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div className="container mx-auto space-y-3 p-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          {/* Form Section */}
          {props.vEtat && props?.vEtat > 0 ? null : (
            <Card className="shadow-lg">
              <form
                action={async (formData: FormData) => {
                  const data = await addCommandeVente(formData);
                  if (data.error) {
                    toast({
                      title: "Message d'erreur",
                      description: (
                        <p dangerouslySetInnerHTML={{ __html: data.error }}></p>
                      ),
                      // variant: "destructive",
                    });
                  }
                }}
                method="POST"
              >
                <input type="hidden" name="v_id" value={props.vId} />

                <CardContent className="mt-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="imei"
                        className="mb-2 block text-sm font-medium"
                      >
                        Code IMEI
                      </label>
                      <div className="relative">
                        <Input
                          id="imei"
                          type="text"
                          name="barcode"
                          placeholder="Entrez le code IMEI"
                          className="pl-10"
                          required
                          maxLength={100}
                        />
                        <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="price"
                        className="mb-2 block text-sm font-medium"
                      >
                        Prix de vente
                      </label>
                      <div className="relative">
                        <Input
                          id="price"
                          type="number"
                          placeholder="Entrez le prix"
                          className="pl-10"
                          required
                          name="prix"
                          defaultValue={0}
                        />
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <SubmitBtn
                      className="h-12 w-full flex-1 text-base"
                      btnLabel={
                        <>
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Ajouter au panier
                        </>
                      }
                    />
                  </div>
                </CardContent>
              </form>
            </Card>
          )}

          {/* Cart Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <Input
                placeholder="Chercher dans le pannier !"
                autoComplete="off"
                autoCorrect="off"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                maxLength={100}
                title="Chercher dans le panier"
              />
              {/* <CardTitle className="flex items-center gap-1">
                <ShoppingCart className="h-5 w-5" />
                Panier
              </CardTitle> */}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>iPhone</TableHead>
                    <TableHead>État</TableHead>
                    {/* <TableHead>Prix</TableHead> */}
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {props.paniers && props.paniers.length > 0 ? (
                    props.paniers
                      .filter(
                        ({ iphone }) =>
                          iphone.i_barcode.includes(searchFilter.trim()) ||
                          (
                            iphone.modele.m_nom +
                            " " +
                            iphone.modele.m_type +
                            " " +
                            iphone.modele.m_memoire +
                            " GO" +
                            iphone.modele.m_classe
                          )
                            .toLowerCase()
                            .includes(searchFilter.toLowerCase().trim()),
                      )
                      .map((panier) => (
                        <TableRow key={panier.i_id}>
                          <TableCell className="font-medium">
                            {panier.iphone.modele.m_nom}{" "}
                            {panier.iphone.modele.m_type}{" "}
                            {panier.iphone.modele.m_memoire} (GO) {" / "}
                            {panier.iphone.modele.m_classe}
                            <div className="text-sm text-gray-500">
                              {panier.iphone.i_barcode}
                            </div>
                          </TableCell>
                          <TableCell>
                            {panier.vc_etat === 0 ? (
                              <Badge>En cours</Badge>
                            ) : panier.vc_etat === 1 ? (
                              <Badge variant="default">Valider</Badge>
                            ) : panier.vc_etat === 2 ? (
                              <Badge variant="destructive">Rendu</Badge>
                            ) : null}
                          </TableCell>
                          {/* <TableCell>{formatWari(panier.vc_prix,{minimumFractionDigits: 0})}</TableCell> */}
                          <TableCell>
                            <div className="flex gap-2">
                              {props.vEtat && props?.vEtat > 0 ? (
                                panier.vc_etat !== 2 && (
                                  <Button
                                    size={"sm"}
                                    title="Retourner"
                                    onClick={async () => {
                                      await editCommandeVente(
                                        panier.vc_id.toString(),
                                      );
                                    }}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                )
                              ) : (
                                <Button
                                  variant="destructive"
                                  size={"sm"}
                                  title="Supprimer"
                                  onClick={async () =>
                                    await deleteCommandeVente(
                                      panier.vc_id.toString(),
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Aucun produit dans le panier
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sale Information Card */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Client / Revendeur
                  </span>
                  <span className="text-sm font-medium">
                    {search.get("c_nom")!}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date</span>
                  <span className="text-sm font-medium">
                    {formatDateTime(search.get("date")!).split("T").join(" a ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    État de la commande
                  </span>
                  <Badge>
                    {props?.vEtat === 0
                      ? "En cours"
                      : props?.vEtat === 1
                        ? "Valider"
                        : "Annuler"}
                  </Badge>
                </div>
              </div>
              {/* <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant total</span>
                  <span className="text-sm font-medium">100 F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Montant restant</span>
                  <span className="text-sm font-medium">100 F</span>
                </div>
              </div> */}
              {props.vEtat && props?.vEtat > 0 ? null : (
                <>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await validateCommandeVente(props.vId);
                    }}
                  >
                    Valider la commande
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
