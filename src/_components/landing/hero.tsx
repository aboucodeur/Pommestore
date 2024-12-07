"use client";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
// import Mali from "@assets/img/mali.png";
// import Moroco from "@assets/img/morocco.png";
// import Image from "next/image";

export const Hero = () => {
  return (
    <section className="container mb-20 grid place-items-center gap-5 py-5 lg:grid-cols-2">
      <div className="space-y-6 text-center lg:text-start">
        <main className="text-5xl font-bold md:text-6xl">
          <h1 className="inline">
            <span className="inline w-max animate-typing bg-gradient-to-r from-[#7da0aa] to-[#353030] bg-clip-text text-transparent">
              Offrez un sourire à vos proches !
            </span>{" "}
          </h1>{" "}
          <h2 className="inline">
            <span className=" inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] bg-clip-text text-transparent">
              Transfert sure ,
            </span>{" "}
            rapide
          </h2>
        </main>

        <p className="mx-auto text-xl text-muted-foreground md:w-10/12 lg:mx-0">
          Découvrez le montant exact de votre transfert avec notre simulateur en
          ligne !
        </p>

        <div className="flex flex-wrap items-center space-y-4 md:space-x-4 md:space-y-0">
          <Button className="w-full animate-pulse md:w-1/3 btn-secondary rounded-full">
            <a href="tel:+22394865879" target="_blank">
              Nous contacter !
            </a>
          </Button>
          <span className="text-xl font-bold">#1</span>
          <motion.div
            whileHover={{ scale: 1, rotate: 180 }}
            whileTap={{
              scale: 1,
              rotate: -180 * 2,
              borderRadius: "100%",
            }}
          >
            <div className="flex select-none gap-4">
              {/* <Image className="w-10" src={Mali} alt="Mali flags" /> */}
              {/* <Image className="w-10" src={Moroco} alt="Maroco flags" /> */}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero cards sections */}
      <div className="z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 180 * 2, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="mockup-phone border-4 shadow-2xl">
            <div className="camera"></div>
            <div className="display">
              <div className="artboard artboard-demo phone-2 w-auto">
                {/* cta */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Shadow effect */}
      <div className="shadow-2xl"></div>
    </section>
  );
};
