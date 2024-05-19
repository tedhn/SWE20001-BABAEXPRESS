import { useEffect, useState } from "react";
import { useAirTable } from "~/Context/AirTableContext";
import { RouteType } from "~/type";
import { useNavigate } from "react-router-dom";
import { formatDate } from "~/utils";
import { ActionIcon, Button, Paper, Text } from "@mantine/core";
import { useUser } from "~/Context/UserContext";
import { IconTrash } from "@tabler/icons-react";
import toast from "react-hot-toast";

const Route = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { getRoutes, deleteRoute } = useAirTable();

  const [routes, setRoutes] = useState<RouteType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const { data } = await getRoutes();

      setRoutes(data);
      console.log(user);
      setIsLoading(false);
    })();
  }, []);

  const handleNavigate = (routeId: string) => {
    navigate(`/routes/${routeId}`);
  };
  const handleDelete = async (routeId: string) => {
    const { success } = await deleteRoute(routeId);
    console.log(success);

    if (success) {
      setRoutes(routes.filter((r) => r.route_Id !== routeId));
      toast.success("Successfully deleted")
    }
    else{
      toast.error("Delete failed")
    }
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
        <Text className="mx-auto text-3xl pt-8 pb-12 font-bold">
          Find Routes Today
        </Text>
      )}

      <div className="grid grid-cols-4 gap-4">
        {routes.map((route) => (
          <RouteCard
            route={route}
            handleNavigate={handleNavigate}
            handleDelete={handleDelete}
            key={route.route_Id}
          />
        ))}
      </div>
    </div>
  );
};

const RouteCard = ({
  route,
  handleNavigate,
  handleDelete,
}: {
  route: RouteType;
  handleNavigate: (route_id: string) => void;
  handleDelete: (route_id: string) => void;
}) => {
  const { user } = useUser();

  return (
    <Paper className="max-w-md min-w-96 rounded overflow-hidden shadow-lg bg-white relative">
      {user?.type === "Admin" && (
        <ActionIcon
          variant="white"
          color="red"
          className="absolute top-5 right-5 rounded-md hover:bg-gray-200 w-fit"
          onClick={() => handleDelete(route.route_Id)}
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
          <div
            className="text-blue-800 hover:underline text-sm cursor-pointer rounded-md hover:bg-gray-200 w-fit p-2"
            onClick={() => handleNavigate("/")}
          >
            Edit
          </div>
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
