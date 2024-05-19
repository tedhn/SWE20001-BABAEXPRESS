import React, {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { TicketType, UserType } from "~/type";

// Define the shape of your context
interface UserContextType {
  user: Omit<UserType, "password"> | undefined;
  updateUser: (newUser: Omit<UserType, "password"> | undefined) => void;
  tickets: TicketType[];
  setTickets: React.Dispatch<SetStateAction<TicketType[]>>;
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
  const [tickets, setTickets] = useState<TicketType[]>([]);

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      setUser(JSON.parse(userString));
    }
  }, []);

  const updateUser = (newUser: Omit<UserType, "password"> | undefined) => {
    setUser(newUser);
  };

  return (
    <User.Provider value={{ user, updateUser, tickets, setTickets }}>
      {children}
    </User.Provider>
  );
};
