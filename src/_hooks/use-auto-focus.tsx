"use client";
import { useEffect, useRef } from "react";

// force user to focus element !
export function useAutoFocus<
  T extends HTMLElement | HTMLButtonElement | undefined,
>() {
  const inputRef: React.MutableRefObject<T | null> = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);
  return inputRef as React.LegacyRef<T>;
}
