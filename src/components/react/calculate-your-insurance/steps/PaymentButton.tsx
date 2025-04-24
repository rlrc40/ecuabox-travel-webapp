import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type {
  InsuranceInsured,
  NewInsurance,
} from "@/models/calculate-your-insurance/new-insurance";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { Button } from "@heroui/react";

interface PaymentData {
  amount: number;
  currency: "eur";
  concept: string;
  insuranceInsuredList?: InsuranceInsured[];
  metadata: object;
}

export default function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [policyParams] = useSessionStorage<PolicyParams>("policy-params", {});

  const [newInsurance] = useSessionStorage<NewInsurance>("new-insurance", {});

  const paymentData: PaymentData = {
    amount: (policyParams.amount || 0) * 100,
    currency: "eur",
    concept: "Seguro de viaje",
    metadata: {
      startDate: policyParams.startDate || "",
      endDate: policyParams.endDate || "",
      pax: policyParams.pax || 0,
      origin: policyParams.originCountry?.name || "",
      destination: policyParams.destinationCountry?.name || "",
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
      <Button
        id="calculate-your-insurance-payment-button"
        type="button"
        onPress={handlePayment}
        className="opacity-disabled pointer-events-none"
        color="primary"
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </Button>
      <span className="">{error && <p>Error: {error}</p>}</span>
    </>
  );
}
