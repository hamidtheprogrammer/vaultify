import React, { ReactNode } from "react";
import Provider from "@/QueryProvider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full">
      <Provider>{children}</Provider>
    </div>
  );
};

export default Layout;
