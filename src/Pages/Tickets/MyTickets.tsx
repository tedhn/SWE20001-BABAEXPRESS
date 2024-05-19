import { Button, Modal, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SetStateAction, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import { RouteType, TicketType } from "~/type";
import { formatDate } from "~/utils";

const MyTickets = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getTickets } = useAirTable();

  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [opened, { open, close }] = useDisclosure(false);
  const [selectedTicket, setSelectedTicket] = useState<{
    ticketInfo: TicketType;
    routeInfo: RouteType;
  } | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      (async () => {
        const { data } = await getTickets(user.userId);

        console.log(data);

        setTickets(data);
        setIsLoading(false);
      })();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      open();
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <Text className="mx-auto text-3xl font-bold">My Tickets</Text>
      {tickets.length === 0 ? (
        <div>
          <div className="text-xl py-8">Start booking now!</div>
          <Button
            size="xs"
            loading={isLoading}
            disabled={isLoading}
            onClick={() => navigate("/routes")}
            className="bg-blue-500 mx-auto w-full"
          >
            Book Now
          </Button>
        </div>
      ) : (
        tickets.map((ticket) => (
          <TicketCard
            ticket={ticket}
            key={ticket.ticket_id}
            setSelectedTicket={setSelectedTicket}
          />
        ))
      )}

      {user && selectedTicket && (
        <Modal
          opened={opened}
          onClose={() => {
            setSelectedTicket(null);
            close();
          }}
          size="md"
          title="Bus Ticket"
          overlayProps={{ opacity: "0.7" }}
        >
          <Paper p="lg">
            <div className="flex justify-between mb-4">
              <Text fw={700}>Passenger Name:</Text>
              <Text>{user.name}</Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Route:</Text>
              <Text>
                {selectedTicket.routeInfo.from} to {selectedTicket.routeInfo.to}
              </Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Departure Time:</Text>
              <Text>
                {formatDate(selectedTicket.routeInfo.departure_Time!, "h:mm a")}
              </Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text className="font-semibold">Departure Date: </Text>
              <Text>
                {formatDate(
                  selectedTicket.routeInfo.departure_Time,
                  "dd/MM/yyy"
                )}
              </Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Seat Number:</Text>
              <Text>{selectedTicket.ticketInfo.seat_numbers}</Text>
            </div>
            {/* <div className="flex justify-between mb-4">
              <Text fw={700}>Price:</Text>
              <Text>
                RM
                {selectedTicket.ticketInfo.seat_numbers.split(",").length *
                  +selectedTicket.routeInfo.price}
              </Text>
            </div> */}
            <Button
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              onClick={() => close()}
              className="bg-blue-500"
            >
              Close
            </Button>
          </Paper>
        </Modal>
      )}
    </div>
  );
};

const TicketCard = ({
  ticket,
  setSelectedTicket,
}: {
  ticket: TicketType;
  setSelectedTicket: React.Dispatch<
    SetStateAction<{
      ticketInfo: TicketType;
      routeInfo: RouteType;
    } | null>
  >;
}) => {
  const { findRoute } = useAirTable();
  const [route, setRoute] = useState<RouteType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { data } = await findRoute(ticket.route_id[0]);

      setRoute(data);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Paper
      p="md"
      shadow="sm"
      className="w-full mx-auto flex items-center space-x-4"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="flex-grow">
            <Text fw={700} size="xl">
              {route?.from} - {route?.to}
            </Text>
            <Text size="sm" c="gray">
              Departure Date:{" "}
              {formatDate(route ? route.departure_Time : Date(), "dd/MM/yyy")}
            </Text>
            <Text size="sm" c="gray">
              Seat Number(s): {ticket.seat_numbers}
            </Text>
          </div>
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              color="blue"
              onClick={() =>
                setSelectedTicket({ ticketInfo: ticket, routeInfo: route! })
              }
            >
              View Ticket
            </Button>
          </div>
        </>
      )}
    </Paper>
  );
};

export default MyTickets;
