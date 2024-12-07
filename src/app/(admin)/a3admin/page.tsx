"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useFormState } from "react-dom";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { signIn } from "~/_lib/sessions";

type unk = unknown;

export default function Page() {
  const [state, action] = useFormState(signIn, {
    error: undefined as unk as string,
  });

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
      <Card className="w-96 border border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center justify-center">
              <CardTitle className="text-primary">A3</CardTitle>
              {/* <CardDescription>
                Bienvenue dans le future ! <br />
              </CardDescription> */}
              {/* Creer mon compte{" "}
              <Link
                className="text-2xl font-bold text-blue-500"
                href="/signup"
                passHref
              >
                ici
              </Link> */}
            </div>
          </div>
        </CardHeader>
        <form action={action}>
          <CardContent className="space-y-4">
            {state?.error && state.error !== "" ? (
              <div className="w-100 rounded-lg bg-red-500 p-3 text-white shadow-lg">
                {state?.error}
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                placeholder="Entrez votre nom d'utilisateur"
                name="username"
                defaultValue="aboubacar"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre mot de passe"
                name="password"
                autoFocus
              />
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button type="submit" className="w-full">
              Se connecter
            </Button> */}
            <SubmitBtn btnLabel="Se connecter" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
