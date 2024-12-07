"use client";

import {
  Barcode,
  Check,
  ChevronsUpDownIcon,
  DollarSign,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useRef, useState } from "react";
import useSWR from "swr";
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
  addCommandeAchat,
  deleteCommandeAchat,
  validateCommandeAchat,
} from "~/_lib/actions";
import { cn, fetcher, formatDateTime } from "~/_lib/utils";
import { toast } from "~/hooks/use-toast";
import { SubmitBtn } from "./modal-form/btn-pending";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type VenteDetailsProps = {
  aId: string;
  aEtat?: number;
  paniers:
    | {
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        i_id: number;
        a_id: number;
        ac_id: number;
        ac_etat: number;
        ac_qte: string;
        ac_prix: string;
        iphone: {
          i_barcode: string;
          modele: {
            m_nom: string;
            m_type: string;
            m_memoire: number;
          };
        };
      }[]
    | undefined;
};

export default function AchatDetails(props: VenteDetailsProps) {
  const search = useSearchParams();
  const fRef = useRef<HTMLFormElement>(null);

  // combo box setup
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const { data: modeles, isLoading } = useSWR<
    {
      en_id: number;
      createdAt: Date;
      updatedAt: Date | null;
      m_id: number;
      m_nom: string;
      m_type: string;
      m_qte: number;
      m_prix: string;
      m_memoire: number;
      deletedAt: Date | null;
    }[]
  >("/api/modeles", fetcher);

  return (
    <div className="container mx-auto space-y-3 p-4">
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-2">
          {/* Form Section */}
          {props.aEtat && props?.aEtat > 0 ? null : (
            <Card className="shadow-lg">
              {/* <CardHeader> */}
              {/* <CardTitle>Ajouter un iphone</CardTitle> */}
              {/* </CardHeader> */}
              <form
                ref={fRef}
                action={async (formData: FormData) => {
                  const data = await addCommandeAchat(formData);
                  if (data.error) {
                    toast({
                      title: "Message d'erreur",
                      description: (
                        <p dangerouslySetInnerHTML={{ __html: data.error }}></p>
                      ),
                      // variant: "destructive",
                    });
                  }
                  if (fRef.current) fRef.current.reset();
                }}
                method="POST"
              >
                <input type="hidden" name="a_id" value={props.aId} />

                <CardContent className="mt-3 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {isLoading ? (
                      <span className="loading loading-spinner loading-lg mb-2 block"></span>
                    ) : (
                      <div>
                        <label
                          className="mb-2 block text-sm font-medium"
                          htmlFor="modele"
                        >
                          Choisir le modele
                        </label>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-full justify-between"
                              ref={focus}
                              id="modele"
                            >
                              {selectedValue
                                ? modeles?.find(
                                    (modele) =>
                                      modele.m_id.toString() === selectedValue,
                                  )?.m_nom +
                                  " " +
                                  modeles?.find(
                                    (modele) =>
                                      modele.m_id.toString() === selectedValue,
                                  )?.m_type +
                                  " " +
                                  modeles?.find(
                                    (modele) =>
                                      modele.m_id.toString() === selectedValue,
                                  )?.m_memoire
                                : "Choisir un modele"}
                              <ChevronsUpDownIcon className="opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput
                                placeholder="Rechercher un membre..."
                                className="h-9"
                              />
                              <CommandList>
                                <CommandEmpty>
                                  Aucun membre trouvé.
                                </CommandEmpty>
                                <CommandGroup heading="Membres">
                                  {modeles?.map((modele) => (
                                    <CommandItem
                                      key={modele.m_id}
                                      onSelect={() => {
                                        setSelectedValue(
                                          modele.m_id.toString(),
                                        );
                                        setOpen(false);
                                      }}
                                      value={
                                        modele.m_nom +
                                        " " +
                                        modele.m_type +
                                        " " +
                                        modele.m_memoire +
                                        " Go"
                                      }
                                    >
                                      {modele.m_nom +
                                        " " +
                                        modele.m_type +
                                        " " +
                                        modele.m_memoire +
                                        " Go"}
                                      {selectedValue ? (
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            selectedValue ===
                                              modele.m_id.toString()
                                              ? "opacity-100"
                                              : "opacity-0",
                                          )}
                                        />
                                      ) : null}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                          {/* Champ caché pour les formulaires */}
                          <input
                            type="hidden"
                            name="m_id"
                            value={selectedValue}
                            required
                          />
                        </Popover>
                      </div>
                    )}
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
                        htmlFor="prix"
                        className="mb-2 block text-sm font-medium"
                      >
                        Prix de vente
                      </label>
                      <div className="relative">
                        <Input
                          id="prix"
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
          <Suspense
            fallback={
              <span className="loading loading-spinner loading-lg"></span>
            }
          >
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
                              " GO"
                            )
                              .toLowerCase()
                              .includes(searchFilter.toLowerCase().trim()),
                        )
                        .map((panier) => (
                          <TableRow key={panier.i_id}>
                            <TableCell className="font-medium">
                              {panier.iphone.modele.m_nom}{" "}
                              {panier.iphone.modele.m_type}{" "}
                              {panier.iphone.modele.m_memoire} (GO)
                              <div className="text-sm text-gray-500">
                                {panier.iphone.i_barcode}
                              </div>
                            </TableCell>
                            <TableCell>
                              {panier.ac_etat === 0 ? (
                                <Badge>En cours</Badge>
                              ) : (
                                <Badge variant="default">Valider</Badge>
                              )}
                            </TableCell>
                            {/* <TableCell>{formatWari(panier.vc_prix,{minimumFractionDigits: 0})}</TableCell> */}
                            <TableCell>
                              <div className="flex gap-2">
                                {props.aEtat && props?.aEtat > 0 ? null : (
                                  <Button
                                    variant="destructive"
                                    size={"sm"}
                                    title="Supprimer"
                                    onClick={async () =>
                                      await deleteCommandeAchat(
                                        panier.ac_id.toString(),
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
          </Suspense>
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
                  <span className="text-sm text-gray-500">Fournisseur</span>
                  <span className="text-sm font-medium">
                    {search.get("f_nom")!}
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
                    {props?.aEtat === 0
                      ? "En cours"
                      : props?.aEtat === 1
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
              {props.aEtat && props?.aEtat > 0 ? null : (
                <>
                  <Separator />
                  <Button
                    className="w-full"
                    onClick={async () => {
                      await validateCommandeAchat(props.aId);
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
