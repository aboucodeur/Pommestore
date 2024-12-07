import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";

import { BanknoteIcon, MapIcon, TimerIcon } from "lucide-react";

interface FeatureProps {
  title: string;
  description: string;
  image: JSX.Element | React.ReactNode;
}

const features: FeatureProps[] = [
  {
    title: "Mali - Maroc",
    description:
      "Effectuez vos transferts en toute securite et en toute faciliter",
    image: <MapIcon size={100} />,
  },
  {
    title: "Delay plus cout",
    description:
      "Nous transferonts votre argent dans un delai convenable et plus court.",
    image: <TimerIcon size={100} />,
  },
  {
    title: "Nos taux predit par l'IA",
    description:
      "Nous utilsons l'intelligence artificielle pour savoir les derniers taux du marche en fin de vous garantir un prix moins chers.",
    image: <BanknoteIcon size={100} />,
  },
];

const featureList: string[] = [
  "Simple",
  "Facile",
  "Rapide",
  "Moins chers",
  "Disponible au Mali",
  "Disponible au Maroc",
];

export const Features = () => {
  return (
    <section id="features" className="container space-y-8 py-24 sm:py-32">
      <h2 className="text-3xl font-bold md:text-center lg:text-4xl">
        Transferez en toute{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
          garantie !
        </span>
      </h2>

      <div className="flex flex-wrap gap-4 md:justify-center">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge variant="secondary" className="text-sm">
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, image }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{description}</CardContent>
            <CardFooter className="flex items-center justify-center">
              {image ? image : null}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
