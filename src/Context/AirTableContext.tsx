import React, { createContext, useContext, useEffect, useState } from "react";
import Airtable, { FieldSet, Records } from "airtable";
import { RegisterSuccessType, UserType } from "~/type";

// Define the shape of your context
interface AirTableType {
  value: Records<FieldSet> | null;
  createUser: (userData: FieldSet) => void;
  loginUser: (email: string, password: string) => Promise<UserType>;
}

const airtable = new Airtable({
  apiKey: import.meta.env.VITE_AIRTABLE_KEY,
}).base("app7lxN6XsmKQxwb8");

// Create the context
const AirTable = createContext<AirTableType | undefined>(undefined);

// Create a custom hook to consume the context
export const useAirTable = () => {
  const context = useContext(AirTable) as AirTableType;
  if (!context) {
    throw new Error("useAirTable must be used within a AirTableProvider");
  }
  return context;
};

// Create the provider component
export const AirTableProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [value, _] = useState<Records<FieldSet> | null>(null);

  useEffect(() => {}, []);

  const createUser = (userData: FieldSet) => {
    return new Promise<RegisterSuccessType>((resolve, reject) => {
      airtable("User").create(
        [
          {
            fields: userData,
          },
        ],
        (err) => {
          if (err) {
            console.error(err);
            reject({ success: false, user: {} as UserType });
          } else {
            resolve({
              success: true,
              user: {
                email: userData.Email as string,
                password: userData.Password as string,
                name: userData.Name as string,
                type: "Customer",
              } as UserType,
            });
          }
        }
      );
    });
  };

  const loginUser = (email: string, password: string) => {
    return new Promise<UserType>((resolve, reject) => {
      const records: UserType[] = [];

      airtable("User")
        .select({
          // Specify the desired fields to fetch
          fields: ["Name", "Email", "Password", "Type"],
          // Additional filters, if any
          // filterByFormula: '...',
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                email: r.get("Email") as string,
                password: r.get("Password") as string,
                name: r.get("Name") as string,
                type: r.get("Type") as string,
              });
            });
            fetchNextPage();
          },
          (err) => {
            if (err) {
              reject(err);
              // resolve({ isAuth: false, user: {} as UserType });
            } else {
              try {
                const user = records.filter((r) => r.email === email)[0];
                const isAuth = user.password === password;

                if (isAuth) {
                  resolve(user);
                } else {
                  reject("Wrong Password");
                }
              } catch (e) {
                console.log(e);
                reject("Record Not Found");
                // resolve({ isAuth: false, user: {} as UserType });
              }
            }
          }
        );
    });
  };

  return (
    <AirTable.Provider value={{ value, createUser, loginUser }}>
      {children}
    </AirTable.Provider>
  );
};
