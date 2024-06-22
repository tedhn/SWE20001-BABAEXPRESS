import { Button, Modal, Paper, Stepper, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useAirTable } from "~/Context/AirTableContext";
import { useUser } from "~/Context/UserContext";
import { RouteType } from "~/type";
import { formatDate } from "~/utils";
import Payment from "../Auth/Payment";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import Timer from "~/Components/Timer";

const RouteDetails = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { findRoute, createTicket, updateBusSeat } = useAirTable();
  const { user, setTickets } = useUser();

  const [route, setRoute] = useState<RouteType | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [duration, setDuration] = useState<number | null>(null);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }

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

  const handleShowModal = () => {
    if (!user) {
      navigate("/login");
      toast.error("Please login to purchase tickets.");
      return;
    } else {
      toast("Please pay for the tickets in 5 mins");
      setDuration(300);
      open();
    }
  };

  const handleCloseModal = () => {
    setActive(0);
    setDuration(null);
    close();
  };

  const handleSeatBooking = async () => {
    const query = {
      seatNumbers: selectedSeats.map((seat) => seat + ""),
      userId: user?.userId!,
      routeId: params.routeId!,
    };

    try {
      const { ticket } = await createTicket(query);

      updateBusSeat(route!, selectedSeats.join(","));

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
    nextStep();
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
          title={
            <div className="flex w-full gap-4">
              <div className="">Bus Ticket</div>
              {duration && <Timer initialMinutes={duration / 60} />}
            </div>
          }
          size={"xl"}
          overlayProps={{ opacity: "0.7" }}
        >
          <Paper p="lg">
            <Stepper active={active} onStepClick={setActive} iconSize={32}>
              <Stepper.Step label="Confirm Tickets">
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

                <Button onClick={nextStep} className="w-full">
                  Next step
                </Button>
              </Stepper.Step>
              <Stepper.Step label="Payment Info">
                <Payment handleSeatBooking={handleSeatBooking} />
              </Stepper.Step>
              <Stepper.Step label="Success">
                <div className="flex flex-col justify-center items-center py-16">
                  <IconCircleCheckFilled color={"#3b82f6"} size={64} />
                  <div className="text-center w-full">
                    Ticket has been booked successfully
                  </div>
                </div>

                <Button
                  variant="filled"
                  radius={"md"}
                  color="#3b82f6"
                  type="submit"
                  onClick={handleCloseModal}
                  className="w-full mt-4 "
                >
                  Close
                </Button>
              </Stepper.Step>
            </Stepper>
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
