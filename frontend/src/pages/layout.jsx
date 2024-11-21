import React from "react";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="h-full min-h-[100vh] w-full">
      <Outlet />
    </div>
  );
}

export default Layout;
