import CalculateYourInsuranceStep from "@/models/calculate-your-insurance/CalculateYoutInsuranceStep";
import { Button, Link } from "@heroui/react";
import { useState } from "react";

interface NextStepButtonProps {
  nextStep: CalculateYourInsuranceStep;
}

export const NextStepButton = ({ nextStep }: NextStepButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const nextStepHref = `/calculate-your-insurance/step-${nextStep}`;

  const prevStepHref = `/calculate-your-insurance/step-${nextStep - 2}`;

  let title = "Siguiente";

  switch (nextStep) {
    case CalculateYourInsuranceStep.Summary:
      title = "Calcular precio";
      break;
    case CalculateYourInsuranceStep.PersonalInfo:
      title = "Contratar";
      break;
    case CalculateYourInsuranceStep.Confirmation:
      title = "Descargar póliza";
      break;

    default:
      break;
  }

  return (
    <div className="flex gap-4">
      {nextStep !== CalculateYourInsuranceStep.OriginAndDestination && (
        <Button href={prevStepHref} as={Link} color="default">
          Anterior
        </Button>
      )}
      <Button
        onPress={() => setIsLoading(true)}
        isLoading={isLoading}
        href={nextStepHref}
        as={Link}
        color="primary"
      >
        {isLoading ? "Loading" : title}
      </Button>
    </div>
  );
};
