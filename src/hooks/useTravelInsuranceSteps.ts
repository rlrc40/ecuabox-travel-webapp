import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { useSessionStorage } from "./useSessionStorage";
import type { Country } from "@/models/country";
import { useState } from "react";
import type { Policy } from "@/models/policy";

const useTravelInsuranceSteps = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [policyParams, setPolicyParams] = useSessionStorage<PolicyParams>(
    "policy-params",
    {},
  );

  const setPolicyDates = (startDate: string, endDate: string) => {
    if (!startDate && !endDate) return;

    setPolicyParams({
      ...policyParams,
      startDate,
      endDate,
    });
  };

  const setPolicyPax = (pax: number | undefined) => {
    setPolicyParams({
      ...policyParams,
      pax,
    });
  };

  const setPolicyDestinationCountry = (destinationCountry: Country) => {
    if (!destinationCountry) return;

    setPolicyParams({
      ...policyParams,
      destinationCountry,
    });
  };

  const setPolicyOriginCountry = (originCountry: Country) => {
    if (!originCountry) return;

    setPolicyParams({
      ...policyParams,
      originCountry,
    });
  };

  const setAmount = (amount: number) => {
    if (!amount) return;

    setPolicyParams({
      ...policyParams,
      amount,
    });
  };

  const getInsurancePolicy = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { startDate, endDate, pax } = policyParams;

      const numberOfDays =
        startDate &&
        endDate &&
        Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1;
      const url =
        new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/policies?`) +
        new URLSearchParams({
          numberOfDays: numberOfDays?.toString() || "0",
          numberOfPax: pax?.toString() || "0",
        }).toString();

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error("Failed fetch insurance data");
      }

      const { policy } = (await response.json()) as { policy: Policy };

      return policy;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const disableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.add("opacity-disabled");
    if (btn) btn.classList.add("pointer-events-none");
  };

  const enableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.remove("opacity-disabled");
    if (btn) btn.classList.remove("pointer-events-none");
  };

  const disablePaymentButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.add("opacity-disabled");
    if (btn) btn.classList.add("pointer-events-none");
  };

  const enablePaymentButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.remove("opacity-disabled");
    if (btn) btn.classList.remove("pointer-events-none");
  };

  return {
    policyParams,
    isLoading,
    error,
    setPolicyParams,
    setPolicyDates,
    setPolicyPax,
    setPolicyDestinationCountry,
    setPolicyOriginCountry,
    setAmount,
    getInsurancePolicy,
    disableNextStepButton,
    enableNextStepButton,
    disablePaymentButton,
    enablePaymentButton,
  };
};

export default useTravelInsuranceSteps;
