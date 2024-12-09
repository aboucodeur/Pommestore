"use client";
import {
  CircleUser,
  LogOutIcon,
  Menu,
  MoonIcon,
  SunDimIcon,
} from "lucide-react";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useMemo } from "react";
import { signOut } from "~/_lib/sessions";
import { AppLink, type LinksType } from "./_menus/applink";
import APP_MENUS from "./_menus/menus";

export default function TopNav(props: { isRoot: boolean }) {
  const { theme, setTheme } = useTheme();

  const APP_LINKS = useMemo<LinksType[]>(
    () => (props.isRoot ? APP_MENUS.root : APP_MENUS.user),
    [props.isRoot],
  );

  const links = APP_LINKS.map(({ link, label, icon }, _idx) => (
    <AppLink key={_idx + 1} link={link} label={label}>
      {icon ? icon : null}
    </AppLink>
  ));

  return (
    // new : sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
    // old : sticky left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-blue-500 px-4 py-2 text-white shadow-lg dark:text-white lg:px-6
    <div className="sticky left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b bg-primary px-4 py-2 text-white shadow-xl backdrop-blur dark:text-white lg:px-6">
      <Sheet>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Image
            width={40}
            height={40}
            src="/favicon/android-chrome-192x192.png"
            alt="iStock Pro logo"
            className="rounded"
          />
          iStock Pro
        </h1>
        <SheetTrigger asChild>
          <button className="shrink-0 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="mt-5 flex flex-col gap-2 text-lg font-medium">
            {links}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
        >
          {theme === "dark" ? <SunDimIcon size={20} /> : <MoonIcon size={20} />}
          <span className="sr-only">Toggle dark mode</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem>
              <form action={signOut}>
                <button type="submit" className="flex flex-wrap">
                  <LogOutIcon className="mr-2" size={18} />
                  Bye bye !
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
