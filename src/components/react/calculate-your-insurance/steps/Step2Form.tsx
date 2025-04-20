import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import type { Country } from "@/models/Country";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function Step2Form({
  countries = [],
}: {
  countries: Country[];
}) {
  const [policyParams, setPolicyParams] = useSessionStorage<PolicyParams>(
    "policy-params",
    {},
  );

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
          onSelectionChange={(item) =>
            setPolicyParams({
              ...policyParams,
              originCountry: countries.find((c) => c.id === item),
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
          onSelectionChange={(item) =>
            setPolicyParams({
              ...policyParams,
              destinationCountry: countries.find((c) => c.id === item),
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
