import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextInput, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAirTable } from "~/Context/AirTableContext";
import { formatDate } from "~/utils";
import { useEffect, useState } from "react";

const RouteEdit = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { findRoute, updateRoute } = useAirTable();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    from: string;
    to: string;
    dateTime: string;
    price: string;
    estimatedDuration: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEditRoute = async (data: {
    from: string;
    to: string;
    dateTime: string;
    price: string;
    estimatedDuration: string;
  }) => {
    setIsLoading(true);

    const query = {
      to: data.to,
      from: data.from,
      price: data.price,
      estimatedDuration: data.estimatedDuration,
      departureTime: formatDate(
        new Date(data.dateTime),
        "yyyy-MM-dd'T'HH:mm:ssXXX"
      ),
      routeId: params.routeId!,
    };

    const { success } = await updateRoute(query);

    setIsLoading(false);
    if (success) {
      toast.success("Route edit successful");
      navigate("/routes");
    } else {
      toast.error("Route edit failed");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (params.routeId) {
      (async () => {
        const { data } = await findRoute(params.routeId!);

        reset({
          from: data.from,
          to: data.to,
          dateTime: formatDate(data.departure_Time, "yyyy-MM-dd'T'HH:mm:ss"),
          estimatedDuration: data.estimated_Duration,
          price: data.price,
        });
        setIsLoading(false);
      })();
    }
  }, []);

  return (
    <>
      <div className="flex gap-2 items-center justify-start cursor-pointer rounded-md hover:bg-gray-200 w-fit p-2" onClick={()=> navigate(-1)}>
        <IconChevronLeft /> Back
      </div>

      <div className="text-3xl w-full text-center my-8">Edit Route</div>
      <form
        onSubmit={handleSubmit(handleEditRoute)}
        className="flex flex-col justify-center items-center gap-4 w-full lg:w-1/2 mx-auto"
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {" "}
            <div className="mb-4 w-full">
              <label
                htmlFor="from"
                className="block text-sm font-medium text-gray-700"
              >
                From
              </label>
              <TextInput
                defaultValue=""
                {...register("from", { required: true })}
                placeholder="From"
                error={errors.from && "This field is required."}
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="to"
                className="block text-sm font-medium text-gray-700"
              >
                To
              </label>
              <TextInput
                defaultValue=""
                {...register("to", { required: true })}
                error={errors.to && "This field is required."}
                placeholder="To"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="datetime"
                className="block text-sm font-medium text-gray-700"
              >
                Date and Time
              </label>
              <TextInput
                defaultValue=""
                type="datetime-local"
                {...register("dateTime", { required: true })}
                error={errors.dateTime && "This field is required."}
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700"
              >
                Duration (hours)
              </label>
              <TextInput
                defaultValue=""
                type="number"
                {...register("estimatedDuration", { required: true })}
                error={errors.estimatedDuration && "This field is required."}
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="seats"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <TextInput
                defaultValue=""
                type="number"
                {...register("price", { required: true })}
                error={errors.price && "This field is required."}
              />
            </div>
          </>
        )}
        <Button
          type="submit"
          className="self-end"
          loading={isLoading}
          disabled={isLoading}
        >
          Submit
        </Button>
      </form>
    </>
  );
};

export default RouteEdit;
