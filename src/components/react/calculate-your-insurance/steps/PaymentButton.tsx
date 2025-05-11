import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type {
  InsuranceInsured,
  NewInsurance,
} from "@/models/calculate-your-insurance/new-insurance";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { Button } from "@heroui/react";
import useDeviceDetection from "@/hooks/useDeviceDetection";

interface NewOrder {
  amount: number;
  currency: string;
  concept: string;
  email: string;
  passengerData: InsuranceInsured[];
  metadata: {
    startDate: string;
    endDate: string;
    pax: number;
    origin: string;
    destination: string;
  };
  createdAt: string;
}

export default function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false);

  const device = useDeviceDetection();

  const [error, setError] = useState<string | null>(null);

  const [policyParams] = useSessionStorage<PolicyParams>("policy-params", {});

  const [newInsurance] = useSessionStorage<NewInsurance>("new-insurance", {});

  const mainInsured =
    newInsurance?.insuranceInsuredList?.find(
      (passenger) => passenger.isMainInsured,
    )?.insured || null;

  const order: NewOrder = {
    amount: (policyParams.amount || 0) * 100,
    currency: "eur",
    concept: newInsurance.policy?.policyNumber || "",
    email: mainInsured?.contactInfoList[0]?.email || "",
    passengerData: newInsurance?.insuranceInsuredList || [],
    createdAt: new Date().toISOString(),
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
        body: JSON.stringify(order),
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
    <div className="flex flex-col md:flex-row-reverse gap-4 md:justify-center">
      <Button
        fullWidth={device === "mobile"}
        id="calculate-your-insurance-payment-button"
        type="button"
        onPress={handlePayment}
        className="opacity-disabled pointer-events-none"
        color="primary"
      >
        {isLoading ? "Procesando..." : "Pagar"}
      </Button>
      <span className="">{error && <p>Error: {error}</p>}</span>
    </div>
  );
}
