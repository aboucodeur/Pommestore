"use client";

import { useMemo } from "react";
import { AppLink, type LinksType } from "./_menus/applink";
import APP_MENUS from "./_menus/menus";

export default function SideNav(props: { isRoot: boolean }) {
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
    <div className="fixed hidden h-full border-r p-2 md:block md:w-60">
      <nav className="text-md flex flex-col gap-2">{links}</nav>
    </div>
  );
}
