import { Container } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./Components/Navbar/NavBar";
import { useEffect } from "react";

const LayoutContainer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location.pathname.split("/")[0]);
    if (location.pathname.split("/")[0] === "") {
      navigate("/dashboard");
    }
  }, []);

  return (
    <Container fluid className="w-full h-fit">
      <NavBar />

      <Outlet />
    </Container>
  );
};

export default LayoutContainer;
