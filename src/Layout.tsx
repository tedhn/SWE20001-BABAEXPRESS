import { Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import NavBar from "./Components/Navbar/NavBar";

const LayoutContainer = () => {
  return (
    <Container fluid className="w-full h-fit">
      <NavBar />

      <Outlet />
    </Container>
  );
};

export default LayoutContainer;
