"use client";

import { AppleIcon, BoxSelectIcon, CoinsIcon, HardDrive } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
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
import { editModele } from "~/_lib/actions";

export default function EditModele({ params }: { params: { id: string } }) {
  const focus = useAutoFocus<HTMLInputElement>();
  const searchParams = useSearchParams();
  const [state, action] = useFormState(editModele, {
    error: undefined as unknown as string,
  });

  return (
    <Modal
      modalTitle="Modifier le modèle"
      modalState={state.error === ""}
      withHeaderClose
    >
      <form action={action} className="w-full md:w-96">
        <div className="flex flex-col gap-3 p-3">
          <input type="hidden" name="id" value={params.id} />

          <div className="grid grid-cols-2 gap-2">
            <div className="relative w-full">
              <AppleIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={focus}
                className="pl-9"
                id="nom"
                name="nom"
                defaultValue={searchParams.get("nom")!}
                required
                maxLength={60}
              />
            </div>

            <div className="relative w-full">
              <BoxSelectIcon className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                id="type"
                name="type"
                defaultValue={searchParams.get("type")!}
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
              defaultValue={searchParams.get("prix")!}
              required
            />
          </div>

          <div className="relative w-full">
            <HardDrive className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
            <Select
              name="memoire"
              required
              defaultValue={searchParams.get("memoire")!}
            >
              <SelectTrigger className="border p-2 pl-9">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="8">8 Go</SelectItem>
                <SelectItem value="16">16 Go</SelectItem>
                <SelectItem value="32">32 Go</SelectItem>
                <SelectItem value="64">64 Go</SelectItem>
                <SelectItem value="128">128 Go</SelectItem>
                <SelectItem value="256">256 Go</SelectItem>
                <SelectItem value="512">512 Go</SelectItem>
                <SelectItem value="1000">1 To</SelectItem>
                <SelectItem value="2000">2 To</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <SubmitBtn>Modifier</SubmitBtn>
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>
      </form>
    </Modal>
  );
}
