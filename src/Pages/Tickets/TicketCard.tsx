import { Button, Paper, Text } from "@mantine/core";
import React, { SetStateAction, useEffect, useState } from "react";
import { useAirTable } from "~/Context/AirTableContext";
import { RouteType, TicketType, UserType } from "~/type";
import { formatDate } from "~/utils";

const TicketCard = ({
  ticket,
  setSelectedTicket,
  isAdminView = false,
}: {
  ticket: TicketType;
  setSelectedTicket: React.Dispatch<
    SetStateAction<{
      ticketInfo: TicketType;
      routeInfo: RouteType;
    } | null>
  >;
  isAdminView?: boolean;
}) => {
  const { findRoute, findUser } = useAirTable();
  const [route, setRoute] = useState<RouteType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customer, setCustomer] = useState<Pick<
    UserType,
    "userId" | "name" | "email" | "phone" | "address"
  > | null>(null);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { data } = await findRoute(ticket.route_id[0]);

      console.log(ticket.user_id[0]);

      if (isAdminView) {
        // const {data}
        const { data } = await findUser(ticket.user_id[0]);

        setCustomer(data);
      }

      console.log(data)

      setRoute(data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Paper
      p="md"
      shadow="sm"
      className="w-full mx-auto flex items-start space-x-4"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex-grow">
            <Text fw={700} size="xl">
              {route?.from} - {route?.to}
            </Text>

            {isAdminView && (
              <>
                {" "}
                <Text size="sm" c="gray">
                  Ticket ID: {ticket.ticket_id}
                </Text>
                <Text size="sm" c="gray">
                  Customer Name : {customer?.name}
                </Text>
                <Text size="sm" c="gray">
                  Phone : {customer?.phone}
                </Text>
              </>
            )}
            <Text size="sm" c="gray">
              Departure Date:{" "}
              {formatDate(route ? route.departure_Time : Date(), "dd/MM/yyy")}
            </Text>
            <Text size="sm" c="gray" className="flex-wrap">
              Seat Number(s): {ticket.seat_numbers}
            </Text>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant={isAdminView ? "filled" : "outline"}
              color={isAdminView ? "red" : "blue"}
              onClick={() =>
                setSelectedTicket({ ticketInfo: ticket, routeInfo: route! })
              }
            >
							{isAdminView ? "Delete Ticket" : "View Ticket"}
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};

export default TicketCard;
