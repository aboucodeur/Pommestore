import { InfoIcon } from "lucide-react";
import { Statistics } from "./stats";

export const About = () => {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <div className="rounded-lg border bg-muted/50 py-12">
        <div className="flex flex-col-reverse gap-8 px-6 md:flex-row md:gap-12">
          <InfoIcon size={100} />

          <div className="bg-green-0 flex w-full flex-col justify-center">
            <div className="pb-6">
              <h2 className="text-3xl font-bold md:text-4xl">
                <span className="bg-gradient-to-b from-primary/60 to-primary bg-clip-text text-transparent">
                  A Propos{" "}
                </span>
                de Nous
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Nous sommes une agence de transfert d&apos;argent expérimentée,
                dédiée à offrir des services de transfert sécurisés et rapides à
                nos clients. Nous nous engageons à fournir une expérience de
                transfert sans tracas, avec des taux compétitifs et des frais
                raisonnables. Notre équipe d&apos;experts travaille dur pour
                s&apos;assurer que vos transferts sont traités avec soin et rapidité.
              </p>
            </div>

            <Statistics />
          </div>
        </div>
      </div>
    </section>
  );
};
