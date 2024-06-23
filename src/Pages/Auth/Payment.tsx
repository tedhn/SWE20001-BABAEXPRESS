import { FC } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@mantine/core";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_AIRTABLE_PRIVATE_KEY);
const options = {
  mode: "payment",
  amount: 1099,
  currency: "usd",
  // Fully customizable with appearance API.
  appearance: {
    /*...*/
  },
};

const Payment: FC<{ handleSeatBooking: () => void }> = ({
  handleSeatBooking,
}) => {
  return (
    //@ts-ignore
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm handleSeatBooking={handleSeatBooking} />
    </Elements>
  );
};

const CheckoutForm: FC<{
  handleSeatBooking: () => void;
}> = ({ handleSeatBooking }) => {
  [];
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (!submitError) {
      handleSeatBooking();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full h-full mx-auto flex flex-col justify-evenly items-center"
    >
      <PaymentElement />

      <Button
        variant="filled"
        radius={"md"}
        color="#3b82f6"
        type="submit"
        disabled={!stripe || !elements}
        className="w-full mt-4 "
      >
        Pay
      </Button>
    </form>
  );
};

export default Payment;
