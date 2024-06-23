import { Button, Modal, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import { RouteType, TicketType } from "~/type";
import { formatDate } from "~/utils";
import TicketCard from "./TicketCard";

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
            <div className="flex justify-between mb-4">
              <Text fw={700}>Bus Number:</Text>
              <Text>{selectedTicket.routeInfo.bus_number}</Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Pick Up Location:</Text>
              <Text>{selectedTicket.routeInfo.pickUpLocation}</Text>
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

export default MyTickets;
