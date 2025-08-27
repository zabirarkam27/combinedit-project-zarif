import React from "react";
import NavBar from "../components/NavBar";

const MainLayout = ({ children, refs }) => {
  return (
    <>
      <NavBar refs={refs} />
      <main>{children}</main>
    </>
  );
};

export default MainLayout;
