"use client";

import { Button } from "@components/ui/button";
import { XCircleIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { type ElementRef, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "~/_lib/utils";

type ModalProps = {
  modalState?: boolean;
  modalTitle?: string;
  modalTitleStyle?:
    | React.ComponentProps<"h3">["className"]
    | string
    | undefined;
  withHeaderClose?: boolean;
  withNoRouteBack?: boolean;
  children: React.ReactNode;
};

export function Modal({
  modalState,
  modalTitle,
  modalTitleStyle,
  withHeaderClose,
  withNoRouteBack = false,
  children,
  ...props
}: ModalProps) {
  const router = useRouter();
  const dialogRef = useRef<ElementRef<"dialog">>(null);

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [router]);

  useEffect(() => {
    if (modalState === true) {
      if (!withNoRouteBack) router.back();
      else dialogRef.current?.close(); // if true execute close
    }
  }, [modalState, router, withNoRouteBack]);

  function onDismiss() {
    if (!withNoRouteBack) router.back();
    else dialogRef.current?.close(); // if true execute close
  }

  // bg-white bg-opacity-90 bg-blend-overlay
  return createPortal(
    <dialog
      ref={dialogRef}
      className="shadow-3xl relative bottom-auto top-6 z-0 rounded-lg dark:bg-black"
      onClose={onDismiss}
      {...props}
    >
      {/* Entete du modal : titre et bouton de fermeture */}
      <div className="flex select-none items-center justify-between p-3">
        {modalTitle ? (
          <h3 className={cn("m-1 text-lg font-bold", modalTitleStyle)}>
            {modalTitle}
          </h3>
        ) : null}
        {withHeaderClose ? (
          <Button
            autoFocus={false}
            variant="ghost"
            className="rounded-full"
            onClick={onDismiss}
          >
            <XIcon focusable={false} className="h-5 w-5 rounded-2xl" />
          </Button>
        ) : null}
      </div>

      {/* Content */}
      {children}

      {/* Bottom close btn : !withHeaderClose */}
      {!withHeaderClose ? (
        <Button onClick={onDismiss} variant="secondary" className="mb-3 ml-3">
          <XCircleIcon /> &nbsp; Annuler
        </Button>
      ) : null}
    </dialog>,
    document.getElementById("modal-root")!,
  );
}
