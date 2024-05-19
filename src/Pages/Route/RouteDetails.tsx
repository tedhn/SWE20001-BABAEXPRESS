import { Button, Modal, Paper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import { RouteType } from "~/type";
import { formatDate } from "~/utils";

const RouteDetails = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { findRoute, createTicket, updateRoute } = useAirTable();
  const { user, setTickets } = useUser();

  const [route, setRoute] = useState<RouteType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (params.routeId) {
        const { data } = await findRoute(params.routeId);

        if (data.bookedSeats) {
          setRoute(data);
        } else {
          setRoute({ ...data, bookedSeats: "" });
        }
      }
    })();
  }, []);

  const handleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleConfirmBooking = async () => {
    const query = {
      seatNumbers: selectedSeats.map((seat) => seat + ""),
      userId: user?.userId!,
      routeId: params.routeId!,
    };

    setIsLoading(true);

    try {
      const { ticket } = await createTicket(query);

      updateRoute(route!, selectedSeats.join(","));

      setTickets((t) => {
        return { ...t, ticket };
      });
      toast.success("Ticket purchased.");
      close();
      navigate("/my-tickets");
    } catch (e) {
      console.log(e);
      toast.error("Ticket purchase Failed.");
    }
    setIsLoading(false);
  };

  const handleShowModal = () => {
    if (!user) {
      navigate("/login");
      toast.error("Please login to purchase tickets.");
      return;
    } else {
      open();
    }
  };

  if (route === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-around items-center gap-10 my-20">
        <div className="w-72">
          <h2 className="text-xl font-bold mb-4">Bus Route Detail</h2>
          <div className="mb-4">
            <span className="font-semibold">Departure: </span>
            {route?.from}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Destination: </span>
            {route?.to}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Departure Time: </span>
            {formatDate(route?.departure_Time!, "h:mm a")}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Departure Date: </span>
            {formatDate(route.departure_Time, "dd/MM/YYY")}
          </div>
          <div className="mb-4">
            <span className="font-semibold">Estimated Duration: </span>
            {route?.estimated_Duration} Hrs
          </div>

          <div className="mb-4">
            <span className="font-semibold">Price:</span> {route?.price} RM
          </div>

          <div className="mb-4">
            {selectedSeats.length > 0 && (
              <div>
                <span className="font-semibold">Selected Seat:</span>{" "}
                {selectedSeats.join(",")}
              </div>
            )}
          </div>
        </div>

        <BusSeatsLayout
          route={route}
          handleSeatSelection={handleSeatSelection}
          selectedSeats={selectedSeats}
        />
      </div>

      <div className="flex justify-center items-center gap-4 w-1/3 mx-auto">
        <Button
          onClick={() => navigate("/routes")}
          className={`col-span-2 grow px-3 py-2 rounded text-gray-700 bg-gray-200 hover:bg-red-500 hover:text-white`}
          // style={(seat + 1) % 2 === 0 ? { marginRight: "80px" } : {}}
        >
          Cancel Booking
        </Button>
        <Button
          disabled={selectedSeats.length === 0}
          onClick={handleShowModal}
          className={`col-span-2 grow px-3 py-2 rounded  ${
            selectedSeats.length === 0
              ? "bg-gray-400 text-gray-700"
              : "bg-blue-500 text-white"
          }`}
        >
          Confirm
        </Button>
      </div>

      {user && (
        <Modal
          opened={opened}
          onClose={close}
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
                {route.from} to {route.to}
              </Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Departure Time:</Text>
              <Text>{formatDate(route?.departure_Time!, "h:mm a")}</Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text className="font-semibold">Departure Date: </Text>
              <Text>{formatDate(route.departure_Time, "dd/MM/yyy")}</Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Seat Number:</Text>
              <Text>{selectedSeats.join(",")}</Text>
            </div>
            <div className="flex justify-between mb-4">
              <Text fw={700}>Price:</Text>
              <Text>RM{selectedSeats.length * +route.price}</Text>
            </div>
            <Button
              fullWidth
              loading={isLoading}
              disabled={isLoading}
              onClick={() => handleConfirmBooking()}
              className="bg-blue-500"
            >
              Confirm
            </Button>
          </Paper>
        </Modal>
      )}
    </>
  );
};

const BusSeatsLayout = ({
  route,
  handleSeatSelection,
  selectedSeats,
}: {
  route: RouteType;
  handleSeatSelection: (number: number) => void;
  selectedSeats: number[];
}) => {
  return (
    <div className="w-1/2 mb-4">
      <div className="grid grid-cols-9 gap-4 mb-10">
        <Button
          disabled
          className={`col-start-6 col-end-10 grow px-3 py-2 roundedbg-gray-200 bg-gray-400  text-gray-700`}
        >
          Driver
        </Button>
      </div>

      {[...Array(10).keys()].map((row) => (
        <div className="grid grid-cols-9 gap-4 mt-2" key={row}>
          <BusSeat
            seat={row * 4 + 1}
            handleSeatSelection={handleSeatSelection}
            selectedSeat={
              selectedSeats.filter((seat) => seat === row * 4 + 1).length > 0
            }
            isTaken={
              route.bookedSeats
                .split(",")
                .filter((seat) => +seat === row * 4 + 1).length === 1
                ? true
                : false
            }
          />
          <BusSeat
            seat={row * 4 + 2}
            handleSeatSelection={handleSeatSelection}
            selectedSeat={
              selectedSeats.filter((seat) => seat === row * 4 + 2).length > 0
            }
            isTaken={
              route.bookedSeats
                .split(",")
                .filter((seat) => +seat === row * 4 + 2).length === 1
                ? true
                : false
            }
          />
          <div className="shrink w-11"></div>
          <BusSeat
            seat={row * 4 + 3}
            handleSeatSelection={handleSeatSelection}
            selectedSeat={
              selectedSeats.filter((seat) => seat === row * 4 + 3).length > 0
            }
            isTaken={
              route.bookedSeats
                .split(",")
                .filter((seat) => +seat === row * 4 + 3).length === 1
                ? true
                : false
            }
          />
          <BusSeat
            seat={row * 4 + 4}
            handleSeatSelection={handleSeatSelection}
            selectedSeat={
              selectedSeats.filter((seat) => seat === row * 4 + 4).length > 0
            }
            isTaken={
              route.bookedSeats
                .split(",")
                .filter((seat) => +seat === row * 4 + 4).length === 1
                ? true
                : false
            }
          />
        </div>
      ))}
    </div>
  );
};

const BusSeat = ({
  seat,
  handleSeatSelection,
  selectedSeat,
  isTaken,
}: {
  seat: number;
  handleSeatSelection: (number: number) => void;
  selectedSeat: boolean;
  isTaken: boolean;
}) => {
  return (
    <Button
      key={seat}
      disabled={isTaken}
      onClick={() => handleSeatSelection(seat)}
      className={`col-span-2 grow px-3 py-2 rounded ${
        isTaken
          ? "bg-red-500 text-white"
          : selectedSeat
          ? "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {isTaken ? "x" : seat}
    </Button>
  );
};

export default RouteDetails;
