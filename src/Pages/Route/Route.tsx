import { useEffect, useState } from "react";
import { useAirTable } from "~/Context/AirTableContext";
import { RouteType } from "~/type";
import { useNavigate } from "react-router-dom";
import { formatDate } from "~/utils";

const Route = () => {
  const navigate = useNavigate();
  const { getRoutes } = useAirTable();

  const [routes, setRoutes] = useState<RouteType[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await getRoutes();

      console.log(data);
      setRoutes(data);
    })();
  }, []);

  const handleNavigate = (routeId: string) => {
    navigate(`/routes/${routeId}`);
  };

  return (
    <div>
      {routes.map((route) => (
        <RouteCard
          route={route}
          handleNavigate={handleNavigate}
          key={route.route_Id}
        />
      ))}
    </div>
  );
};

const RouteCard = ({
  route,
  handleNavigate,
}: {
  route: RouteType;
  handleNavigate: (route_id: string) => void;
}) => {
  return (
    <div className="max-w-md min-w-96 rounded overflow-hidden shadow-lg bg-white">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">
          {route.from} to {route.to}
        </div>
        <div className="text-gray-500 text-sm">
          Departure Time: {formatDate(route.departure_Time, "hh:mm:ss a")}{" "}
          <br />
          Estimated Duration: {route.estimated_Duration} Hrs
          <br />
          <div>Price: {route.price} RM</div>
        </div>
        <div className="flex justify-end items-baseline">
          <div
            className="text-blue-800 hover:underline text-sm cursor-pointer py-2"
            onClick={() => handleNavigate(route.route_Id)}
          >
            View more
          </div>
        </div>
      </div>
    </div>
  );
};

export default Route;
