import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <div className="h-16 flex justify-between items-center">
      <div>BaBa Express</div>

      <div className="flex justify-center items-center">
        <div
          className="font-bold text-xs hover:underline cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </div>
        <Button variant="filled" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
