import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import toast from "react-hot-toast";

type LoginFormType = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const { value, loginUser } = useAirTable();
  const { updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  useEffect(() => {
    value?.forEach(function (record) {
      console.log("Retrieved", record.get("Name"));
    });
  }, []);

  const handleLogin: SubmitHandler<LoginFormType> = async ({
    email,
    password,
  }) => {
    setIsLoading(true);
    try {
      const user = await loginUser(email, password);

      updateUser({
        name: user.name,
        email: user.email,
        type: user.type,
        userId: user.userId,
        address: user.address,
        phone: user.phone,
      });
      toast.success("Logged in successfully");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      toast.error("Logged in failed");
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(handleLogin)}
      className="flex flex-col justify-center items-center gap-4 w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="text-3xl">LOGIN</div>
      <TextInput
        placeholder="Email"
        className={"w-full"}
        {...register("email", { required: true })}
        error={errors.email ? "This field is required" : false}
      />
      <PasswordInput
        placeholder="Password"
        className="w-full"
        {...register("password", { required: true })}
        error={errors.email ? "This field is required" : false}
      />
      <Button
        variant="filled"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        type="submit"
      >
        Login
      </Button>
      <div className="text-xs flex justify-center items-center gap-1">
        <div>Don't have an account? </div>
        <div
          className="font-bold  hover:underline cursor-pointer"
          onClick={() => navigate("/register")}
        >
          Register now
        </div>
      </div>
    </form>
  );
};

export default Login;
