import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";

type RegisterFormType = {
  email: string;
  name: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const { createUser, loginUser } = useAirTable();
  const { updateUser } = useUser();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>();

  const handleRegister: SubmitHandler<RegisterFormType> = async (data) => {
    const { email, name, password } = data;
    setIsLoading(true);
    try {
      createUser({
        Name: name,
        Password: password,
        Email: email,
      });
      const user = await loginUser(email, password);

      updateUser({
        name: user.name,
        email: user.email,
        type: user.type,
        userId: user.userId,
      });
      toast.success("User account created successfully");
      navigate("/dashboard");
    } catch (e) {
      console.log(e);
      toast.error("Registered failed");
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(handleRegister)}
      className="flex flex-col justify-center items-center gap-4 w-96 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <div className="text-3xl">Register</div>
      <TextInput
        placeholder="Full Name"
        className={"w-full"}
        {...register("name", { required: true })}
        error={errors.name ? "This field is required" : false}
      />
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
        error={errors.password ? "This field is required" : false}
      />
      <Button
        variant="filled"
        loading={isLoading}
        disabled={isLoading}
        fullWidth
        type="submit"
      >
        Register
      </Button>

      <div className="text-xs flex justify-center items-center gap-1">
        <div>Already registered?</div>

        <div
          className="font-bold text-xs hover:underline cursor-pointer"
          onClick={() => navigate("/login")}
        >
          Log In
        </div>
      </div>
    </form>
  );
};

export default Register;
