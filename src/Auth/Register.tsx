import { Button, TextInput } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
const Register = () => {
  const navigate = useNavigate();
  const { createUser } = useAirTable();
  const handleRegister = () => {
    createUser({
      Name: "TEST2",
      Password: "1234564",
      Email: "tes2t@gmail.com",
    });
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-3xl">Register</div>
      <TextInput placeholder="Full Name" className={"w-full"} />
      <TextInput placeholder="Email" className={"w-full"} />
      <TextInput placeholder="Password" className="w-full" />
      <Button variant="filled" fullWidth onClick={handleRegister}>
        Register
      </Button>

      <div
        className="font-bold text-xs hover:underline cursor-pointer"
        onClick={() => navigate("/login")}
      >
        Log In
      </div>
    </div>
  );
};

export default Register;
