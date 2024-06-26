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
  updateBusSeat: (
    route: RouteType,
    selectedSeat: string
  ) => Promise<{ success: boolean }>;
  getTickets: (userId: string) => Promise<{ data: TicketType[] }>;
  createRoute: (query: {
    from: string;
    to: string;
    departureTime: string;
    estimatedDuration: string;
    price: string;
  }) => Promise<{ success: boolean }>;
  deleteRoute: (routeId: string) => Promise<{ success: boolean }>;
  updateRoute: (query: {
    from: string;
    to: string;
    departureTime: string;
    estimatedDuration: string;
    price: string;
    routeId: string;
  }) => Promise<{ success: boolean }>;
  getAllTickets: () => Promise<{ data: TicketType[] }>;
  deleteTicket: (ticketId: string) => Promise<{ success: boolean }>;
  findUser: (id: string) => Promise<{
    data: Pick<UserType, "userId" | "name" | "email" | "phone" | "address">;
  }>;
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
                phone: r.get("Phone") as string,
                address: r.get("Address") as string,
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

  const findUser = (id: string) => {
    const records: Pick<
      UserType,
      "userId" | "name" | "email" | "phone" | "address"
    >[] = [];

    return new Promise<{
      data: Pick<UserType, "userId" | "name" | "email" | "phone" | "address">;
    }>((resolve, reject) => {
      airtable("User")
        .select({
          // Specify the desired fields to fetch
          fields: ["Name", "Email", "Phone", "Address"],
          // Additional filters, if any
          // filterByFormula: '...',
        })
        .eachPage(
          (pageRecords, fetchNextPage) => {
            pageRecords.forEach((r) => {
              records.push({
                userId: r.getId() as string,
                email: r.get("Email") as string,
                name: r.get("Name") as string,
                phone: r.get("Phone") as string,
                address: r.get("Address") as string,
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
                const route = records.filter((r) => r.userId === id)[0];

                console.log(route);

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
            "Bus_Number",
            "Pick_Up_Location",
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
                bus_number: r.get("Bus_Number") as string,
                pickUpLocation: r.get("Pick_Up_Location") as string,
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

  const updateBusSeat = (route: RouteType, selectedSeats: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Route").update(
        [
          {
            id: route.route_Id,
            fields: {
              Booked_Seats:
                selectedSeats === ""
                  ? ""
                  : route.bookedSeats + "," + selectedSeats,
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
            "Bus_Number",
            "Pick_Up_Location",
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
                bus_number: r.get("Bus_Number") as string,
                pickUpLocation: r.get("Pick_Up_Location") as string,
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
                console.log(records);
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
  const getAllTickets = () => {
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

                resolve({ data: records });
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

  const deleteTicket = (ticketId: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Ticket").destroy([ticketId], (err) => {
        if (err) {
          console.error(err);
          return reject({ success: false });
        }

        return resolve({ success: true });
      });
    });
  };

  const createRoute = (query: {
    from: string;
    to: string;
    departureTime: string;
    estimatedDuration: string;
    price: string;
  }) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Route").create(
        [
          {
            fields: {
              Route_Id: uuidv4(),
              From: query.from,
              To: query.to,
              Departure_Time: query.departureTime,
              Estimated_Duration: query.estimatedDuration,
              Price: query.price,
            },
          },
        ],
        (err) => {
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

  const deleteRoute = (routeId: string) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Route").destroy([routeId], (err) => {
        if (err) {
          reject({ success: false });
          return;
        }

        resolve({ success: true });
      });
    });
  };

  const updateRoute = (query: {
    from: string;
    to: string;
    departureTime: string;
    estimatedDuration: string;
    price: string;
    routeId: string;
  }) => {
    return new Promise<{ success: boolean }>((resolve, reject) => {
      airtable("Route").update(
        [
          {
            id: query.routeId,
            fields: {
              From: query.from,
              To: query.to,
              Departure_Time: query.departureTime,
              Estimated_Duration: query.estimatedDuration,
              Price: query.price,
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

  return (
    <AirTable.Provider
      value={{
        value,
        createUser,
        loginUser,
        getRoutes,
        findRoute,
        createTicket,
        updateBusSeat,
        getTickets,
        createRoute,
        deleteRoute,
        updateRoute,
        getAllTickets,
        deleteTicket,
        findUser,
      }}
    >
      {children}
    </AirTable.Provider>
  );
};
