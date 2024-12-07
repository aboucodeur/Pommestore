"use client";
import { PlusCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { Modal } from "~/_components/modal";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { Input } from "~/_components/ui/input";
import { useAutoFocus } from "~/_hooks/use-auto-focus";
import { editFournisseur } from "~/_lib/actions";

export default function Page({ params }: { params: { id: string } }) {
  const focus = useAutoFocus<HTMLInputElement>();
  const [state, action] = useFormState(editFournisseur, {
    error: undefined as unknown as string,
  });

  const search = useSearchParams();

  return (
    <Modal
      modalTitle="Modifier le fournisseur"
      modalState={state.error === ""}
      withHeaderClose
    >
      <form action={action} className="mx-auto w-full md:w-96">
        <input type="hidden" name="id" value={params.id} />

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
              defaultValue={search.get("nom") ?? ""}
              className="rounded-lg border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="tel" className="text-sm font-medium">
              Téléphone
            </label>
            <Input
              type="tel"
              name="tel"
              id="tel"
              defaultValue={search.get("tel") ?? ""}
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
              defaultValue={search.get("adr") ?? ""}
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