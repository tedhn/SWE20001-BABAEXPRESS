import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Airtable, { FieldSet, Records } from "airtable";
import { RegisterSuccessType, RouteType, TicketType, UserType } from "~/type";

// Define the shape of your context
interface AirTableType {
  value: Records<FieldSet> | null;
  createUser: (userData: FieldSet) => void;
  loginUser: (email: string, password: string) => Promise<UserType>;
  getRoutes: () => Promise<{ data: RouteType[] }>;
  findRoute: (id: string) => Promise<{ data: RouteType }>;
  createTicket: (query: {
    seatNumbers: string[];
    userId: string;
    routeId: string;
  }) => Promise<{ ticket: TicketType; success: boolean }>;
  updateRoute: (
    route: RouteType,
    selectedSeat: string
  ) => Promise<{ success: boolean }>;
  getTickets: (userId: string) => Promise<{ data: TicketType[] }>;
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
            fields: { ...userData, User_Id: uuidv4() },
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
                userId: r.getId() as string,
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
                  resolve({ ...user });
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

  const getRoutes = () => {
    const records: RouteType[] = [];

    return new Promise<{ data: RouteType[] }>((resolve, reject) => {
      airtable("Route")
        .select({
          // Specify the desired fields to fetch
          fields: [
            "Route_Id",
            "From",
            "To",
            "Departure_Time",
            "Estimated_Duration",
            "Price",
            "Booked_Seats",
          ],
          // Additional filters, if any
          // filterByFormula: '...',
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                route_Id: r.getId() as string,
                from: r.get("From") as string,
                to: r.get("To") as string,
                departure_Time: r.get("Departure_Time") as string,
                estimated_Duration: r.get("Estimated_Duration") as string,
                price: r.get("Price") as string,
                bookedSeats: r.get("Booked_Seats") as string,
              });
            });
            fetchNextPage();
          },
          (err) => {
            if (err) {
              reject(err);
              // resolve({ isAuth: false, user: {} as UserType });
            } else {
              resolve({ data: records });
            }
          }
        );
    });
  };

  const updateRoute = (route: RouteType, selectedSeats: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Route").update(
        [
          {
            id: route.route_Id,
            fields: {
              Booked_Seats: route.bookedSeats + "," + selectedSeats,
            },
          },
        ],
        function (err) {
          if (err) {
            console.error(err);
            reject({ success: false });

            return;
          }
          resolve({ success: true });
        }
      );
    });
  };

  const findRoute = (id: string) => {
    const records: RouteType[] = [];

    return new Promise<{ data: RouteType }>((resolve, reject) => {
      airtable("Route")
        .select({
          // Specify the desired fields to fetch
          fields: [
            "Route_Id",
            "From",
            "To",
            "Departure_Time",
            "Estimated_Duration",
            "Price",
            "Booked_Seats",
          ],
          // Additional filters, if any
          // filterByFormula: '...',
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                route_Id: r.getId() as string,
                from: r.get("From") as string,
                to: r.get("To") as string,
                departure_Time: r.get("Departure_Time") as string,
                estimated_Duration: r.get("Estimated_Duration") as string,
                price: r.get("Price") as string,
                bookedSeats: r.get("Booked_Seats") as string,
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
                const route = records.filter((r) => r.route_Id === id)[0];

                resolve({ data: route });
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

  const createTicket = (query: {
    seatNumbers: string[];
    userId: string;
    routeId: string;
  }) => {
    return new Promise<{ success: boolean; ticket: TicketType }>(
      (resolve, reject) => {
        const ticket_id = uuidv4();
        airtable("Ticket").create(
          [
            {
              fields: {
                Ticket_Id: ticket_id,
                SeatNumbers: query.seatNumbers.join(","),
                Route_Id: [query.routeId],
                User_Id: [query.userId],
              },
            },
          ],
          (err, record) => {
            if (err) {
              reject(err);
              return;
            } else {
              resolve({
                success: true,
                ticket: {
                  ticket_id: record![0].getId(),
                  seat_numbers: query.seatNumbers.join(","),
                  user_id: query.userId,
                  route_id: query.routeId,
                },
              });
            }
          }
        );
      }
    );
  };

  const getTickets = (userId: string) => {
    const records: TicketType[] = [];

    return new Promise<{ data: TicketType[] }>((resolve, reject) => {
      airtable("Ticket")
        .select({
          fields: ["Route_Id", "SeatNumbers", "User_Id"],
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                ticket_id: r.getId(),
                route_id: r.get("Route_Id") as string,
                seat_numbers: r.get("SeatNumbers") as string,
                user_id: r.get("User_Id") as string,
              });
            });
            fetchNextPage();
          },
          async (err) => {
            if (err) {
              reject(err);
              // resolve({ isAuth: false, user: {} as UserType });
            } else {
              try {
                // const a: { ticket: TicketType; route: RouteType }[] = [];
                const userTickets = records.filter(
                  (r) => r.user_id[0] === userId
                );

                resolve({ data: userTickets });
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
    <AirTable.Provider
      value={{
        value,
        createUser,
        loginUser,
        getRoutes,
        findRoute,
        createTicket,
        updateRoute,
        getTickets,
      }}
    >
      {children}
    </AirTable.Provider>
  );
};
