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
import { editVente } from "~/_lib/actions";
import { fetcher, formatDateTime } from "~/_lib/utils";

export default function EditVentePage({ params }: { params: { id: string } }) {
  const focus = useAutoFocus<HTMLInputElement>();
  const [state, action] = useFormState(editVente, {
    error: undefined as unknown as string,
  });

  const search = useSearchParams();
  const { data: clients, isLoading } = useSWR<
    {
      c_id: number;
      c_nom: string;
      c_tel: string | null;
      c_adr: string | null;
      c_type: string;
    }[]
  >("/api/clients", fetcher);

  return (
    <Modal
      modalTitle="Modifier la vente"
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
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input
              ref={focus}
              type="datetime-local"
              name="date"
              id="date"
              defaultValue={formatDateTime(search.get("date")!)}
              className="rounded-lg border p-2"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="c_id" className="text-sm font-medium">
              Client
            </label>
            <Select
              name="c_id"
              disabled={isLoading}
              defaultValue={search.get("c_id")!}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client) => (
                  <SelectItem key={client.c_id} value={client.c_id.toString()}>
                    {client.c_nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
