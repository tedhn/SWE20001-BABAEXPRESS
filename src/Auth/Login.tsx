import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { value, loginUser } = useAirTable();
  const { updateUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    value?.forEach(function (record) {
      console.log("Retrieved", record.get("Name"));
    });
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);

      updateUser({ name: user.name, email: user.email, type: user.type });
    } catch (e) {
      console.log(e);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4 w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="text-3xl">LOGIN</div>
      <TextInput
        placeholder="Username"
        className={"w-full"}
        onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordInput
        placeholder="Password"
        className="w-full"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="filled"
        fullWidth
        loading={isLoading}
        onClick={handleLogin}
      >
        Login
      </Button>
      <div
        className="font-bold text-xs hover:underline cursor-pointer"
        onClick={() => navigate("/register")}
      >
        Register now
      </div>
    </div>
  );
};

export default Login;
