import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/widgets/header/header";

export function Layout() {
  return (
    <div className="relative h-full min-h-[100vh] w-full bg-white text-[#262626]">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
