import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import type { Country } from "@/models/country";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect } from "react";

export default function Step2Form({
  countries = [],
}: {
  countries: Country[];
}) {
  const [policyParams, setPolicyParams] = useSessionStorage<PolicyParams>(
    "policy-params",
    {},
  );

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

  useEffect(() => {
    disableNextStepButton();
  }, []);

  useEffect(() => {
    if (policyParams.originCountry?.id && policyParams.destinationCountry?.id)
      enableNextStepButton();
    else disableNextStepButton();
  }, [policyParams, enableNextStepButton]);

  return (
    <form className="max-w-sm mx-auto">
      <div className="flex w-[300px] flex-wrap md:flex-nowrap gap-4 mb-5">
        <Autocomplete
          id="origin"
          className="max-w-xs"
          defaultItems={countries}
          label="Origen"
          placeholder="Selecciona tu país de origen"
          aria-label="Selecciona tu país de origen"
          defaultSelectedKey={
            policyParams.originCountry?.id &&
            `${policyParams.originCountry?.id}`
          }
          onSelectionChange={(item) =>
            setPolicyParams({
              ...policyParams,
              originCountry: countries.find(
                (c) => Number(c.id) === Number(item),
              ),
            })
          }
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div className="flex w-[300px] flex-wrap md:flex-nowrap gap-4">
        <Autocomplete
          id="destination"
          className="max-w-xs"
          defaultItems={countries}
          label="Destino"
          placeholder="Selecciona tu país de destino"
          aria-label="Selecciona tu país de destino"
          defaultSelectedKey={
            policyParams.destinationCountry?.id &&
            `${policyParams.destinationCountry?.id}`
          }
          onSelectionChange={(item) =>
            setPolicyParams({
              ...policyParams,
              destinationCountry: countries.find(
                (c) => Number(c.id) === Number(item),
              ),
            })
          }
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </form>
  );
}
