import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { Button } from "@heroui/react";
import useDeviceDetection from "@/hooks/useDeviceDetection";
import useNewInsurance from "@/hooks/useNewInsurance";
import useOrders, { type NewOrder } from "@/hooks/useOrders";

export default function PaymentButton() {
  const [isLoading, setIsLoading] = useState(false);

  const device = useDeviceDetection();

  const [error, setError] = useState<string | null>(null);

  const [policyParams] = useSessionStorage<PolicyParams>("policy-params", {});

  const { newInsurance, setPaymentSessionId } = useNewInsurance();

  const { createOrder } = useOrders();

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

      const data = await createOrder(order);

      if (!data) {
        throw new Error("Failed to create order");
      }
      if (!data.sessionId) {
        throw new Error("No session ID returned from order creation");
      }

      setPaymentSessionId(data.sessionId);

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
    <div className="flex flex-col gap-4 md:flex-row-reverse md:justify-center">
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
