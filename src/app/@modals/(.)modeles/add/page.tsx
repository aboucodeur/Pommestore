"use client";

import { AppleIcon, BoxSelectIcon, CoinsIcon } from "lucide-react";
import { useFormState } from "react-dom";
import { Modal } from "~/_components/modal";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import { Textarea } from "~/_components/ui/textarea";
import { useAutoFocus } from "~/_hooks/use-auto-focus";
import { addModele } from "~/_lib/actions";

export default function AddModele() {
  const [state, action] = useFormState(addModele, {
    error: undefined as unknown as string,
  });
  const focus = useAutoFocus<HTMLInputElement>();

  return (
    <Modal
      modalTitle="Ajouter un modèle"
      modalState={state.error === ""}
      withHeaderClose
    >
      <form action={action} className="w-full md:w-96">
        <div className="flex flex-col gap-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative w-full">
              <AppleIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                ref={focus}
                id="nom"
                name="nom"
                required
                maxLength={60}
                defaultValue={"iPhone "}
              />
            </div>

            <div className="relative w-full">
              <BoxSelectIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="type"
                name="type"
                required
                maxLength={25}
              />
            </div>
          </div>

          <div className="relative w-full">
            <CoinsIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              id="prix"
              name="prix"
              type="number"
              step="0.01"
              required
            />
          </div>

          <div className="relative w-full">
            <Label
              className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground"
              htmlFor="memoire"
            >
              Go
            </Label>
            <Input
              className="pl-9"
              id="memoire"
              name="memoire"
              type="number"
              required
            />
          </div>

          <div>
            <Label htmlFor="imeis">Codes IMEI</Label>
            <Textarea
              id="imeis"
              name="imeis"
              placeholder="123456789;123456789"
              className="h-32"
              maxLength={999999999999}
              minLength={8}
              onKeyPress={(e) => {
                if (e.key === " ") {
                  e.currentTarget.value += ";";
                  return false;
                }
                return e.key !== "Enter";
              }}
              // onInput={() => updateCount()}
            />
          </div>

          <SubmitBtn>Ajouter</SubmitBtn>
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>
      </form>
    </Modal>
  );
}
