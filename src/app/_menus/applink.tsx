import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PropsWithChildren } from "react";
import { cn } from "~/_lib/utils";

export type LinksType = {
  link: string;
  label: string;
  icon?: React.ReactNode;
};

export function AppLink({
  link,
  label,
  children,
}: PropsWithChildren<LinksType>) {
  const pathname = usePathname(); // not include ?query and sub route
  const isActive =
    link === "/" ? pathname === link : pathname.trim().includes(link);

  if (!link || !label) return;
  return (
    <Link
      href={link}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
      )}
    >
      {children}
      {label}
    </Link>
  );
}
