"use client";
import { useFormStatus } from "react-dom";
import { cn } from "~/_lib/utils";
import { Button, buttonVariants, type ButtonProps } from "../ui/button";

/**
 * Button pour l'attente de l'action du formulaire
 * - Placer dans les serveurs actions !
 */

type BtnProps = {
  btnLabel?: React.ReactNode | JSX.Element | string;
  loadingNode?: React.ReactNode | JSX.Element | string;
};

export function SubmitBtn({
  className,
  variant,
  size,
  asChild = false,
  btnLabel,
  loadingNode,
  ...props
}: ButtonProps & BtnProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn(buttonVariants({ variant, size, className }))}
      asChild={asChild}
      {...props}
      disabled={pending}
    >
      {pending
        ? (loadingNode ?? (
            <span className="loading loading-spinner loading-md"></span>
          ))
        : (btnLabel ?? "Valider")}
    </Button>
  );
}