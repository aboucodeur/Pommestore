"use client";

import { AppleIcon, BoxSelectIcon, CoinsIcon, HardDrive } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-dom";
import { Modal } from "~/_components/modal";
import { SubmitBtn } from "~/_components/modal-form/btn-pending";
import { Input } from "~/_components/ui/input";
import { Label } from "~/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/_components/ui/select";
import { Switch } from "~/_components/ui/switch";
import { Textarea } from "~/_components/ui/textarea";
import { useAutoFocus } from "~/_hooks/use-auto-focus";
import { addModele } from "~/_lib/actions";

export default function AddModele() {
  const [state, action] = useFormState(addModele, {
    error: undefined as unknown as string,
  });
  const focus = useAutoFocus<HTMLInputElement>();
  const [isArrivage, setIsArrivage] = useState(false);

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
              <Select name="type" required defaultValue="Simple">
                <SelectTrigger className="border p-2 pl-9 shadow-lg">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Pro Max">ProMax</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Plus">Plus</SelectItem>
                  <SelectItem value="Max">Max</SelectItem>
                  <SelectItem value="Mini">Mini</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="SE">SE</SelectItem>
                  <SelectItem value="WatchS8">Watch S8</SelectItem>
                  <SelectItem value="WatchS9">Watch S9</SelectItem>
                  <SelectItem value="WatchS10">Watch S10</SelectItem>
                  <SelectItem value="WatchU1">Watch Ultra 1</SelectItem>
                  <SelectItem value="WatchU2">Watch Ultra 2</SelectItem>
                </SelectContent>
              </Select>
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
              defaultValue={0}
              required
            />
          </div>

          <div className="relative w-full">
            <HardDrive className="absolute left-0 top-0 m-3 h-4 w-4 text-muted-foreground" />
            <Select name="memoire" required defaultValue="128">
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

          <div>
            <Label htmlFor="imeis">Codes IMEI</Label>
            <Textarea
              id="imeis"
              name="imeis"
              placeholder="123456789;123456789"
              className="h-32"
              maxLength={999999999999}
              minLength={4}
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

          {/* hidden input for  */}
          {!isArrivage ? (
            <input type="hidden" name="classe" value="CARTONS" />
          ) : (
            <input type="hidden" name="classe" value="ARRIVAGES" />
          )}
          <div className="flex items-center gap-2">
            <Label>Arrivages</Label>
            <Switch
              checked={isArrivage}
              onCheckedChange={(e) => setIsArrivage(e)}
            />
          </div>

          <SubmitBtn>Ajouter</SubmitBtn>
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
        </div>
      </form>
    </Modal>
  );
}
