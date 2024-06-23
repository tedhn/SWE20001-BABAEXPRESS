import { Button, Modal, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import { RouteType, TicketType } from "~/type";
import TicketCard from "./TicketCard";
import { useDisclosure } from "@mantine/hooks";

const AllTickets = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getAllTickets, deleteTicket, updateBusSeat } = useAirTable();

  const [tickets, setTickets] = useState<TicketType[]>([]);

  const [selectedTicket, setSelectedTicket] = useState<{
    ticketInfo: TicketType;
    routeInfo: RouteType;
  } | null>(null);

  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (user) {
      // setIsLoading(true);

      (async () => {
        const { data } = await getAllTickets();

        console.log(data);

        setTickets(data);
        // setIsLoading(false);
      })();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      open();
    }
  }, [selectedTicket]);

  const handleDeleteTicket = async () => {
    if (selectedTicket) {
      console.log(selectedTicket);
      await deleteTicket(selectedTicket.ticketInfo.ticket_id);
      await updateBusSeat(selectedTicket.routeInfo, "");
      
      console.log(tickets);
      
      
      setTickets((t) => {
        return t.filter(
          (ticket) => ticket.ticket_id !== selectedTicket.ticketInfo.ticket_id
        );
      });
      close();
    }
  };

  return (
    <div>
      {tickets.map((ticket) => (
        <TicketCard
          ticket={ticket}
          key={ticket.ticket_id}
          setSelectedTicket={setSelectedTicket}
          isAdminView
        />
      ))}

      <Modal opened={opened} onClose={close} title="Confirm Deletion">
        <Text>Are you sure you want to delete this item?</Text>
        <div className="flex justify-end mt-4">
          <Button className="mr-2" variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={handleDeleteTicket}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AllTickets;
