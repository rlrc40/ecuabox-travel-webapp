import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type {
  CalculateYourInsuranceForm,
  Traveler,
} from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface PaymentData {
  amount: number;
  currency: "eur";
  concept: string;
  travelers?: Traveler[];
  metadata: object;
}

export default function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [{ travelers, amount = 0, ...formValue }] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const paymentData: PaymentData = {
    amount: amount * 100,
    currency: "eur",
    concept: "Seguro de viaje",
    travelers,
    metadata: {
      ...formValue,
    },
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await loadStripe(
        import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      );

      const url = new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/orders`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        id="calculate-your-insurance-payment-button"
        type="button"
        onClick={handlePayment}
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </button>
      {error && <p>Error: {error}</p>}
    </>
  );
}
