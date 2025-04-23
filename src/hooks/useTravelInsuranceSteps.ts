import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { useSessionStorage } from "./useSessionStorage";

const useTravelInsuranceSteps = () => {
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

  const setPolicyPax = (pax: number) => {
    if (!pax) return;
    setPolicyParams({
      ...policyParams,
      pax,
    });
  };

  const disableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.replace("ui-button", "ui-button-disabled");
  };

  const enableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.replace("ui-button-disabled", "ui-button");
  };

  return {
    policyParams,
    setPolicyParams,
    setPolicyDates,
    setPolicyPax,
    disableNextStepButton,
    enableNextStepButton,
  };
};

export default useTravelInsuranceSteps;
