import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar/NavBar";
import { Suspense } from "react";

const LayoutContainer = () => {
  return (
    <Container fluid className="w-full h-fit">
      <NavBar />

      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </Container>
  );
};

export default LayoutContainer;
