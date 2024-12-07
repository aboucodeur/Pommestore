"use client";

import { Badge } from "@components/ui/badge";
import { Card, CardContent, CardHeader } from "@components/ui/card";
import { Input } from "@components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { Calendar, HardDrive, Search, User } from "lucide-react";
import Image from "next/image";
import { cn, formatDateTime } from "~/_lib/utils";
import { Button } from "./ui/button";

type IphoneSearchProps = {
  barcode: string;
  searchResults: {
    createdAt: Date;
    updatedAt: Date | null;
    m_id: number;
    deletedAt: Date | null;
    i_id: number;
    i_barcode: string;
    i_instock: 0 | 1;
    modele: {
      m_nom: string;
      m_type: string;
      m_memoire: number;
      en_id: number;
    };
    vcommandes: {
      createdAt: Date;
      vc_etat?: number | undefined;
      vente: {
        client: {
          c_nom: string;
        };
      };
    }[];
  }[];
};

export default function IphoneSearch(props: IphoneSearchProps) {
  const { searchResults, barcode } = props;

  // const [searchImei, setSearchImei] = useState("");
  // const [searchResults, setSearchResults] = useState(mockData);

  // const handleSearch = () => {
  //   const results = mockData.filter((phone) => phone.imei.includes(searchImei));
  //   setSearchResults(results);
  // };

  // const clearSearch = () => {
  //   setSearchImei("");
  //   setSearchResults(mockData);
  // };

  return (
    <div className="container mx-auto space-y-4 px-3 py-6">
      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Rechercher par IMEI..."
            className="w-full py-6 pl-10 pr-10 text-lg"
            name="imei"
            defaultValue={barcode}
          />
          {/* {searchImei && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )} */}
        </div>
        <Button type="submit" className="w-full px-8 py-6 text-lg sm:w-auto">
          Rechercher
        </Button>
      </form>

      {searchResults.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-lg text-gray-500">
            Aucun résultat trouvé pour cet IMEI.
          </p>
        </Card>
      ) : (
        searchResults.map((phone) => (
          <Card
            key={phone.i_id}
            className="overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between p-2">
              <div className="flex items-center gap-4">
                {/* <div className="flex h-12 w-12 p-3 items-center justify-center rounded-lg bg-gray-200"> */}
                {/* <Smartphone className="h-6 w-6 text-gray-600" /> */}
                <Image
                  src="/images/iphone_icon.svg"
                  alt="iPhone"
                  width={45}
                  height={45}
                />
                {/* </div> */}
                <div>
                  <h2 className="text-xl font-bold">
                    {phone.modele.m_nom} {phone.modele.m_type}{" "}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    IMEI: {phone.i_barcode}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  "badge badge-md p-3 font-bold text-white",
                  phone.i_instock === 1 ? "badge-success" : "badge-error",
                )}
              >
                {phone.i_instock === 1 ? "Disponible" : "Non disponible"}
              </span>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <HardDrive className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Stockage
                      </div>
                      <div className="font-medium">
                        {phone.modele.m_memoire} (GO)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Date d&apos;arrivage
                      </div>
                      <div className="font-medium">
                        {formatDateTime(phone.createdAt, {
                          format: "YYYY-MM-DD",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <h3 className="mb-2 text-lg font-semibold">
                    Historique des commandes
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Date</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="w-[100px]">Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {phone.vcommandes.map((order, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 flex-shrink-0" />
                              {formatDateTime(order?.createdAt, {
                                format: "YYYY-MM-DD",
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 flex-shrink-0" />
                              {order.vente.client.c_nom}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="whitespace-nowrap text-xs"
                            >
                              {order.vc_etat === 1
                                ? "Vendu"
                                : order.vc_etat === 2
                                  ? "Rendu"
                                  : "En cours"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
