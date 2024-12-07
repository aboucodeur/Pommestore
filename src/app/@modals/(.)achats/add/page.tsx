"use client";

import { PlusCircleIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import useSWR from "swr";
import { Modal } from "~/_components/modal";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { Input } from "~/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { useAutoFocus } from "~/_hooks/use-auto-focus";
import { addAchat } from "~/_lib/actions";
import { fetcher } from "~/_lib/utils";

export default function AddAchatPage() {
  const focus = useAutoFocus<HTMLInputElement>();
  const [state, action] = useFormState(addAchat, {
    error: undefined as unknown as string,
  });

  const search = useSearchParams();

  const { data: fournisseurs, isLoading } = useSWR<
    {
      f_id: number;
      f_nom: string;
      f_tel: string | null;
      f_adr: string | null;
    }[]
  >("/api/fournisseurs", fetcher);

  return (
    <Modal
      modalTitle="Ajouter un achat"
      modalState={search.get("show") === "1"}
      withNoRouteBack
      withHeaderClose
    >
      <form action={action} className="mx-auto w-full md:w-96">
        <div className="flex flex-col gap-3 p-3">
          {state.error ? (
            <div className="rounded-lg bg-red-500 p-3 text-white">
              {state.error}
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              ref={focus}
              type="datetime-local"
              name="date"
              id="date"
              className="rounded-lg border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="f_id" className="text-sm font-medium">
              Fournisseur
            </label>
            <Select name="f_id" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {fournisseurs?.map((fournisseur) => (
                  <SelectItem
                    key={fournisseur.f_id}
                    value={fournisseur.f_id.toString()}
                  >
                    {fournisseur.f_nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SubmitBtn
            btnLabel={
              <div className="flex items-center gap-1">
                <PlusCircleIcon className="h-4 w-4" />
                Ajouter
              </div>
            }
          />
        </div>
      </form>
    </Modal>
  );
}
