import React, { createContext, useContext, useEffect, useState } from "react";
import { UserType } from "~/type";

// Define the shape of your context
interface UserContextType {
  user: Omit<UserType, "password"> | undefined;
  updateUser: (newUser: Omit<UserType, "password">) => void;
}

// Create the context
const User = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to consume the context
export const useUser = () => {
  const context = useContext(User) as UserContextType;
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<Omit<UserType, "password"> | undefined>(
    undefined
  );

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user") as string));
  }, []);

  const updateUser = (newUser: Omit<UserType, "password">) => {
    setUser(newUser);
  };

  return <User.Provider value={{ user, updateUser }}>{children}</User.Provider>;
};
