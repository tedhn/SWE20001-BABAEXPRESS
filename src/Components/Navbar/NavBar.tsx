import { Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "~/Context/UserContext";

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

  const [active, setActive] = useState(location.pathname.split("/")[1]);

  useEffect(() => {
    const newActive = location.pathname.split("/")[1];

    if (newActive !== active) {
      setActive(newActive);
    }
  }, [location]);

  const handleRouteChange = (routeName: string) => {
    setActive(routeName);
    navigate(routeName);
  };

  return (
    <div className="h-20 flex justify-between items-center">
      {/* <div className="flex justify-start items-baseline gap-8"> */}
      <div className="text-2xl font-bold">BaBa Express</div>

      <div className="flex justify-center items-center gap-2">
        <CustomNavLink
          routeName="Routes"
          active={active}
          handleClick={handleRouteChange}
        />
        {user && (
          <CustomNavLink
            routeName="My Tickets"
            active={active}
            handleClick={handleRouteChange}
          />
        )}
      </div>
      {/* </div> */}

      <div className="flex justify-center items-center gap-4">
        <div
          className="font-bold text-xs hover:underline cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </div>
        <Button
          variant="filled"
          radius={"md"}
          color="#3b82f6"
          onClick={() => navigate("/login")}
        >
          Log In
        </Button>
      </div>
    </div>
  );
};

const CustomNavLink = ({
  routeName,
  active,
  handleClick,
}: {
  routeName: string;
  active: string;
  handleClick: (route: string) => void;
}) => (
  <a
    key={routeName}
    className="inline-block leading-4 py-2 px-3 text-gray-700  text-sm font-medium border-2 border-transparent hover:underline rounded-md cursor-pointer"
    style={
      active === routeName.toLowerCase().replace(" ", "-")
        ? { background: "#3b82f6", color: "#f9fafb" }
        : {}
    }
    onClick={() => handleClick(routeName.toLowerCase().replace(" ", "-"))}
  >
    {routeName}
  </a>
);
export default NavBar;
