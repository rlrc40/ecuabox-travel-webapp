import useTravelInsuranceSteps from "@/hooks/useTravelInsuranceSteps";
import { EUROPEAN_COUNTRIES, type Country } from "@/models/country";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { useEffect, type Key } from "react";

const autocompleteClassName =
  "flex w-full md:w-[300px] flex-wrap md:flex-nowrap gap-4 md:mx-auto";

export default function Step2Form({
  countries = [],
}: {
  countries: Country[];
}) {
  const {
    policyParams,
    setPolicyDestinationCountry,
    setPolicyOriginCountry,
    disableNextStepButton,
    enableNextStepButton,
  } = useTravelInsuranceSteps();

  const handleDestinationCountryChange = (item: Key | null) => {
    if (!item) return;

    const selectedCountry = findCountryById(Number(item));

    if (selectedCountry) setPolicyDestinationCountry(selectedCountry);
  };

  const handleOriginCountryChange = (item: Key | null) => {
    if (!item) return;

    const selectedCountry = findCountryById(Number(item));

    if (selectedCountry) setPolicyOriginCountry(selectedCountry);
  };

  const findCountryById = (id: string | number) => {
    const country = countries.find((c) => Number(c.id) === Number(id));

    return country || null;
  };

  const europeCountries = countries.filter(
    (country) =>
      country.id !== 130 &&
      EUROPEAN_COUNTRIES.includes(country.translations["EN"]?.toUpperCase()),
  );

  useEffect(() => {
    disableNextStepButton();
  }, []);

  useEffect(() => {
    if (policyParams.originCountry?.id && policyParams.destinationCountry?.id)
      enableNextStepButton();
    else disableNextStepButton();
  }, [policyParams, enableNextStepButton]);

  return (
    <div className="w-full md:max-w-sm">
      <div className={`${autocompleteClassName} mb-5`}>
        <Autocomplete
          id="origin"
          className="md:max-w-xs"
          defaultItems={countries}
          label="Origen"
          placeholder="Selecciona tu país de origen"
          aria-label="Selecciona tu país de origen"
          defaultSelectedKey={`${policyParams.originCountry?.id || ""}`}
          onSelectionChange={handleOriginCountryChange}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
      <div className={autocompleteClassName}>
        <Autocomplete
          id="destination"
          className="md:max-w-xs"
          defaultItems={europeCountries}
          label="Destino"
          placeholder="Selecciona tu país de destino"
          aria-label="Selecciona tu país de destino"
          defaultSelectedKey={`${policyParams.destinationCountry?.id || ""}`}
          onSelectionChange={handleDestinationCountryChange}
        >
          {(item) => (
            <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
          )}
        </Autocomplete>
      </div>
    </div>
  );
}
