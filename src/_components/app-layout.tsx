"use client";

import React from "react";

export function AppLayout({
  children,
  TopNav,
  SideNav,
}: {
  children: React.ReactNode;
  TopNav: JSX.Element;
  SideNav: JSX.Element;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {TopNav}
      <div className="flex flex-1">
        {SideNav}
        <div className="flex-1 p-2 md:ml-60 md:block">
          {children}
        </div>
      </div>
    </div>
  );
}
