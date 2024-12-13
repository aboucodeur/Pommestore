import {
  ArrowLeftRightIcon,
  HomeIcon,
  PackageMinusIcon,
  PackagePlus,
  SearchIcon,
  TruckIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { type LinksType } from "./applink";

const APP_MENUS: { root: LinksType[]; user: LinksType[] } = {
  root: [
    {
      link: "/a3admin/dashboard",
      label: "Tableaux de bord",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      link: "/a3admin/user",
      label: "Utilisateurs",
      icon: <UserIcon className="h-4 w-4" />,
    },
  ],
  user: [
    {
      link: "/",
      label: "Tableaux de bord",
      icon: <HomeIcon className="h-4 w-4" />,
      prefetch: true,
    },
    {
      link: "/modeles",
      label: "Stocks",
      icon: (
        <Image
          width={15}
          height={15}
          alt="apple logo"
          src="/images/apple_logo.png"
        />
      ),
      prefetch: true,
    },
    {
      link: "/search",
      label: "Recherche",
      icon: <SearchIcon className="h-4 w-4" />,
      prefetch: true,
    },
    {
      link: "/achats",
      label: "Achats",
      icon: <PackagePlus className="h-4 w-4" />,
      prefetch: true,
    },
    {
      link: "/ventes",
      label: "Ventes",
      icon: <PackageMinusIcon className="h-4 w-4" />,
      prefetch: true,
    },
    {
      link: "/clients",
      label: "Clients",
      icon: <UserIcon className="h-4 w-4" />,
    },
    {
      link: "/retours",
      label: "Retours",
      icon: <ArrowLeftRightIcon className="h-4 w-4" />,
      prefetch: true,
    },
    {
      link: "/fournisseurs",
      label: "Fournisseurs",
      icon: <TruckIcon className="h-4 w-4" />,
    },
  ],
};

export default APP_MENUS;
