"use client";
import { PlusCircleIcon } from "lucide-react";
import { useFormState } from "react-dom";
import { Modal } from "~/_components/modal";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { Input } from "~/_components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/_components/ui/select";
import { useAutoFocus } from "~/_hooks/use-auto-focus";
import { addClient } from "~/_lib/actions";

export default function Page() {
  const focus = useAutoFocus<HTMLInputElement>();
  const [state, action] = useFormState(addClient, {
    error: undefined as unknown as string,
  });

  return (
    <Modal
      modalTitle="Ajouter un client"
      modalState={state.error === ""}
      withHeaderClose
    >
      <form action={action} className="w-full md:w-96">
        <div className="flex flex-col gap-3 p-3">
          {state.error ? (
            <div className="rounded-lg bg-red-500 p-3 text-white">
              {state.error}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="nom" className="text-sm font-medium">
              Nom
            </label>
            <Input
              ref={focus}
              type="text"
              name="nom"
              id="nom"
              className="rounded-lg border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SIM">SIMPLE</SelectItem>
                <SelectItem value="REV">REVENDEUR (COKSAIRE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tel" className="text-sm font-medium">
              Téléphone
            </label>
            <Input
              type="tel"
              name="tel"
              id="tel"
              className="rounded-lg border p-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="adr" className="text-sm font-medium">
              Adresse
            </label>
            <Input
              type="text"
              name="adr"
              id="adr"
              className="rounded-lg border p-2"
            />
          </div>

          <SubmitBtn
            btnLabel={
              <div className="flex items-center gap-1">
                <PlusCircleIcon className="h-4 w-4" />
                Soumettre
              </div>
            }
          />
        </div>
      </form>
    </Modal>
  );
}