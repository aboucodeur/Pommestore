"use client";
import { MoonIcon, SunDimIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  return (
    <header className="bg-blur sticky left-0 right-0 top-0 z-50 flex h-14 w-full items-center justify-between border-b-4 border-blue-400 px-4 py-2 text-black bg-blend-overlay shadow-2xl backdrop-blur dark:text-white lg:px-6">
      <h1 className="animate-typing overflow-hidden whitespace-nowrap w-max text-2xl font-bold text-blue-500">
        Easy-Cash
      </h1>
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
      </div>
    </header>
  );
};
