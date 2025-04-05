import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import { useSessionStorage } from "@/hooks/useSessionStorage";

interface PaymentData {
  amount: number;
  currency: "eur";
  concept: string;
  metadata: {
    startDate: string;
    endDate: string;
    pax: number;
    origin: string;
    destination: string;
  };
}

export default function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formValue] = useSessionStorage<CalculateYourInsuranceForm>(
    "calculateYourInsuranceForm",
    {},
  );

  const paymentData: PaymentData = {
    amount: 50,
    currency: "eur",
    concept: "Seguro de viaje",
    metadata: {
      startDate: formValue.startDate || "",
      endDate: formValue.endDate || "",
      pax: formValue.pax || 0,
      origin: formValue.origin || "",
      destination: formValue.destination || "",
    },
  };

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stripe = await loadStripe(
        import.meta.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
      );

      const url = new URL(`http://127.0.0.1:1337/api/orders`);

      console.log("New Strapi request:", url.toString());
      console.log("Token:", import.meta.env.STRAPI_TOKEN);

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
      setSessionId(data.sessionId);
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
        type="button"
        onClick={handlePayment}
        className="w-100 inline-block text-center rounded-sm border cursor-pointer border-primary px-12 py-3 text-sm font-medium text-primary hover:bg-secondary hover:text-white focus:ring-3 focus:outline-hidden"
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </button>
      {error && <p>Error: {error}</p>}
    </>
  );
}
