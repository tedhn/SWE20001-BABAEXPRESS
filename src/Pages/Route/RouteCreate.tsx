import { useForm, FieldValues } from "react-hook-form";
import { TextInput, Button } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { useAirTable } from "~/Context/AirTableContext";
import { formatDate } from "~/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const RouteCreate = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    from: string;
    to: string;
    dateTime: string;
    price: string;
    estimatedDuration: string;
  }>();

  const { createRoute } = useAirTable();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoute = async (data: FieldValues) => {
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
    };

    try {
      const res = await createRoute(query);
      setIsLoading(false);
      if (res.success) {
        toast.success("Route created successfully.");
        navigate("/routes");
      }
    } catch (e) {
      console.log(e);
      toast.error("Failed to create new route.");
    }
  };

  return (
    <>
      <div
        className="flex gap-2 items-center justify-start cursor-pointer rounded-md hover:bg-gray-200 w-fit p-2"
        onClick={() => navigate(-1)}
      >
        <IconChevronLeft /> Back
      </div>

      <div className="text-3xl w-full text-center my-8">Create a Route</div>
      <form
        onSubmit={handleSubmit(handleCreateRoute)}
        className="flex flex-col justify-center items-center gap-4 w-full lg:w-1/2 mx-auto"
      >
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

export default RouteCreate;
