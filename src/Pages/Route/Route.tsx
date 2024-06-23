import { useEffect, useState } from "react";
import { useAirTable } from "~/Context/AirTableContext";
import { RouteType } from "~/type";
import { useNavigate } from "react-router-dom";
import { formatDate } from "~/utils";
import { ActionIcon, Button, Modal, Paper, Text } from "@mantine/core";
import { useUser } from "~/Context/UserContext";
import { IconTrash } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useDisclosure } from "@mantine/hooks";
import SearchBar from "~/Components/SearchBar";

const Route = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getRoutes, deleteRoute } = useAirTable();

  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [filteredRoute, setFilteredRoute] = useState<RouteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { data } = await getRoutes();

      setRoutes(data);
      setFilteredRoute(data);
      setIsLoading(false);
    })();
  }, []);

  const handleNavigate = (routeId: string) => {
    navigate(`/routes/${routeId}`);
  };
  const handleDelete = async () => {
    setIsLoading(true);
    const { success } = await deleteRoute(selectedRouteId);

    if (success) {
      setRoutes(routes.filter((r) => r.route_Id !== selectedRouteId));
      toast.success("Successfully deleted");
    } else {
      toast.error("Delete failed");
    }

    close();
    setIsLoading(false);
  };

  const onSearch = (query: string) => {
    // Implement your search logic here

    if (query === "") {
      setFilteredRoute(routes);
      return;
    }

    setFilteredRoute(
      routes.filter(
        (route) =>
          route.from.toLowerCase().includes(query.toLowerCase()) ||
          route.to.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-start items-start flex-col">
      {user?.type === "Admin" ? (
        <Button
          loading={isLoading}
          disabled={isLoading}
          onClick={() => navigate("create")}
          className="bg-blue-500 self-start mt-8 mb-12"
        >
          Add Route
        </Button>
      ) : (
        <Text className="mx-auto text-3xl py-8 font-bold">
          Find Routes Today
        </Text>
      )}

      <SearchBar onSearch={onSearch} />

      <div className="grid grid-cols-4 gap-4">
        {filteredRoute.map((route) => (
          <RouteCard
            route={route}
            handleNavigate={handleNavigate}
            openDeleteConfirmationModal={() => {
              open();
              setSelectedRouteId(route.route_Id);
            }}
            key={route.route_Id}
          />
        ))}
      </div>

      <Modal
        title="Confirm Deletion"
        opened={opened}
        onClose={close}
        size="sm"
        overlayProps={{ opacity: "0.7" }}
      >
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            Are you sure you want to delete this item?
          </p>
          <div className="flex justify-center">
            <Button
              onClick={close}
              variant="outline"
              color="gray"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleDelete()}
              variant="outline"
              color="red"
              loading={isLoading}
              disabled={isLoading}
              className="ml-2"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const RouteCard = ({
  route,
  handleNavigate,
  openDeleteConfirmationModal,
}: {
  route: RouteType;
  handleNavigate: (route_id: string) => void;
  openDeleteConfirmationModal: () => void;
}) => {
  const { user } = useUser();

  return (
    <Paper className="max-w-md min-w-96 rounded overflow-hidden shadow-lg bg-white relative">
      {user?.type === "Admin" && (
        <ActionIcon
          variant="white"
          color="red"
          className="absolute top-5 right-5 rounded-md hover:bg-gray-200 w-fit"
          onClick={() => openDeleteConfirmationModal()}
        >
          <IconTrash style={{ width: "70%", height: "70%" }} stroke={2} />
        </ActionIcon>
      )}

      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {route.from} to {route.to}
        </div>
        <div className="text-gray-500 text-sm">
          Departure Time: {formatDate(route.departure_Time, "hh:mm:ss a")}{" "}
          <br />
          Departure Date: {formatDate(route.departure_Time, "dd/MM/yyy")} <br />
          Estimated Duration: {route.estimated_Duration} Hrs
          <br />
          <div>Price: {route.price} RM</div>
        </div>
        <div className="flex justify-end items-baseline">
          {user?.type === "Admin" && (
            <div
              className="text-blue-800 hover:underline text-sm cursor-pointer rounded-md hover:bg-gray-200 w-fit p-2"
              onClick={() => handleNavigate(`edit/${route.route_Id}`)}
            >
              Edit
            </div>
          )}
          <div
            className="text-blue-800 hover:underline text-sm cursor-pointer rounded-md hover:bg-gray-200 w-fit p-2"
            onClick={() => handleNavigate(route.route_Id)}
          >
            View more
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default Route;
