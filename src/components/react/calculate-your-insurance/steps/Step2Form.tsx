import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import type { Country } from "@/models/Country";
import { AutocompleteInput } from "../../ui/AutoCompleteInput";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

export default function Step2Form({
  countries = [],
}: {
  countries: Country[];
}) {
  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const countryList = countries.map((country) => ({
    label: country.name,
    key: country.name,
  }));

  return (
    <form className="max-w-sm mx-auto">
      <div className="flex w-[300px] flex-wrap md:flex-nowrap gap-4 mb-5">
        <Autocomplete
          id="origin"
          className="max-w-xs"
          defaultItems={countryList}
          label="Origen"
          placeholder="Selecciona tu país de origen"
          aria-label="Selecciona tu país de origen"
          onSelectionChange={(item) =>
            setFormValue({ ...formValue, origin: item as string })
          }
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div className="flex w-[300px] flex-wrap md:flex-nowrap gap-4">
        <Autocomplete
          id="destination"
          className="max-w-xs"
          defaultItems={countryList}
          label="Destino"
          placeholder="Selecciona tu país de destino"
          aria-label="Selecciona tu país de destino"
          onSelectionChange={(item) =>
            setFormValue({ ...formValue, destination: item as string })
          }
        >
          {(item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </form>
  );
}
