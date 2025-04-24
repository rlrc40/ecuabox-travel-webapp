import type { Country } from "@/models/country";
import {
  Autocomplete,
  AutocompleteItem,
  Checkbox,
  DatePicker,
  Input,
  Tab,
  Tabs,
  type DateValue,
} from "@heroui/react";
import { useEffect, useState } from "react";

import { parseDate } from "@internationalized/date";
import useNewInsurance from "@/hooks/useNewInsurance";
import useTravelInsuranceSteps from "@/hooks/useTravelInsuranceSteps";

interface InsuredFormProps {
  countries: Country[];
}

export default function InsuredForm({ countries }: InsuredFormProps) {
  const {
    newInsurance,
    initInsuranceInsured,
    changeInsured,
    changeInsuredAddress,
    changeInsuredContact,
    changeInsuredCountry,
    changeInsuredProvince,
  } = useNewInsurance();

  const { policyParams, disablePaymentButton, enablePaymentButton } =
    useTravelInsuranceSteps();

  const [documentError, setDocumentError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);

  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const { pax = 1 } = policyParams;

  const { insuranceInsuredList = [] } = newInsurance;

  const handleInsuredChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value, type, checked } = e.target;

    changeInsured(index, id, type === "checkbox" ? checked : value);
  };

  const handleInsuredAddressChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;

    changeInsuredAddress(index, id, value);
  };

  const handleInsuredContactChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;

    changeInsuredContact(index, id, value);
  };

  const handleInsuredBirthdateChange = (
    index: number,
    date: DateValue | null,
  ) => {
    if (!date) return;

    const birthDate = date.toString();

    changeInsured(index, "birthDate", birthDate);
  };

  const handleInsuredCountryChange = (index: number, key: number) => {
    const country = countries.find((c) => c.id === key);

    if (!country) return;

    changeInsuredCountry(index, country);
  };

  const handleInsuredProvinceChange = (index: number, key: number) => {
    const province = provinceItems.find((p) => p.id === key);

    if (!province) return;

    changeInsuredProvince(index, province);
  };

  const validateDocument = (document: string): boolean => {
    const dniRegex = /^\d{8}[A-HJ-NP-TV-Z]$/i;
    const nieRegex = /^[XYZ]\d{7}[A-HJ-NP-TV-Z]$/i;
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/i;
    return (
      dniRegex.test(document) ||
      nieRegex.test(document) ||
      cifRegex.test(document)
    );
  };

  const handleDocumentChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;

    if (!validateDocument(value))
      setDocumentError(`Formato de documento inválido.`);
    else setDocumentError(null);

    changeInsured(index, id, value);
  };

  const provinceItems =
    countries.find(
      (c) =>
        c.id ===
        insuranceInsuredList[activeTab]?.insured?.addressInfoList[0]
          ?.commercialCountry?.idDyn,
    )?.provinces || [];

  const navigateToFirstStep = () =>
    (window.location.href = "/calculate-your-insurance/step-1");

  useEffect(() => {
    if (pax === 0) navigateToFirstStep();
    else initInsuranceInsured(pax);
  }, []);

  useEffect(() => {
    const allValid =
      insuranceInsuredList.every(
        ({ insured }) =>
          insured?.documentNumber &&
          insured.name &&
          insured.surname &&
          insured.contactInfoList?.length &&
          insured.contactInfoList[0].email &&
          insured.birthDate,
      ) && termsAndConditions;

    if (allValid) enablePaymentButton();
    else disablePaymentButton();
  }, [newInsurance.insuranceInsuredList, termsAndConditions]);

  return (
    <div>
      <div className="tabs flex space-x-4 mb-6">
        <Tabs
          aria-label="Viajeros"
          radius="full"
          onSelectionChange={(index) => setActiveTab(Number(index))}
        >
          {insuranceInsuredList.map((_, index) => (
            <Tab
              key={index}
              title={`Viajero ${index + 1}`}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </Tabs>
      </div>
      <form>
        {insuranceInsuredList.map(({ insured, isMainInsured }, index) => (
          <div
            key={index}
            className={`tab-content ${activeTab === index ? "block" : "hidden"}`}
          >
            <div className="mb-10  p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Viajero {index + 1} {isMainInsured && "(Titular)"}
              </h2>

              {/* General Data */}
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Input
                  id="name"
                  label="Nombre"
                  aria-label="Nombre"
                  value={insured.name || ""}
                  onChange={(e) => handleInsuredChange(index, e)}
                  isRequired
                />
                <Input
                  id="surname"
                  label="Apellidos"
                  aria-label="Apellidos"
                  isRequired
                  value={insured.surname || ""}
                  onChange={(e) => handleInsuredChange(index, e)}
                />
                <Input
                  className="max-w-[284px]"
                  id="documentNumber"
                  label="Documento de Identidad"
                  aria-label="Documento de Identidad"
                  placeholder="DNI, NIE o CIF"
                  value={insured.documentNumber || ""}
                  onChange={(e) => handleDocumentChange(index, e)}
                  isRequired
                  isInvalid={!!documentError}
                  errorMessage={documentError}
                />
                <DatePicker
                  className="max-w-[284px]"
                  label="Fecha de Nacimiento"
                  aria-label="Fecha de Nacimiento"
                  value={
                    insured.birthDate
                      ? (parseDate(insured.birthDate) as DateValue)
                      : undefined
                  }
                  onChange={(date) => handleInsuredBirthdateChange(index, date)}
                  isRequired
                />
              </div>

              {/* Contact Data */}
              <h3 className="text-md font-semibold mb-2">Datos de Contacto</h3>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Input
                  type="phone"
                  id="phoneNumber"
                  label="Teléfono"
                  aria-label="Teléfono"
                  value={insured.contactInfoList[0].phoneNumber || ""}
                  onChange={(e) => handleInsuredContactChange(index, e)}
                />
                <Input
                  type="email"
                  id="email"
                  label="Email"
                  aria-label="Email"
                  value={insured.contactInfoList[0].email || ""}
                  onChange={(e) => handleInsuredContactChange(index, e)}
                  isRequired
                />
              </div>

              {/* Address Data */}
              <h3 className="text-md font-semibold mb-2">Dirección</h3>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Input
                  id="commercialAddress"
                  label="Dirección"
                  aria-label="Dirección"
                  value={insured.addressInfoList[0].commercialAddress || ""}
                  onChange={(e) => handleInsuredAddressChange(index, e)}
                />
                <Input
                  id="commercialPostalCode"
                  label="Código Postal"
                  aria-label="Código Postal"
                  value={insured.addressInfoList[0].commercialPostalCode || ""}
                  onChange={(e) => handleInsuredAddressChange(index, e)}
                />
                <Autocomplete
                  id="country"
                  className="max-w-xs"
                  defaultItems={countries}
                  label="País"
                  aria-label="País"
                  defaultSelectedKey={`${insured.addressInfoList[0]?.commercialCountry?.idDyn}`}
                  onSelectionChange={(item) =>
                    handleInsuredCountryChange(index, Number(item))
                  }
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
                <Autocomplete
                  id="province"
                  className="max-w-xs"
                  defaultItems={provinceItems}
                  label="Provincia"
                  aria-label="Provincia"
                  defaultSelectedKey={`${insured.addressInfoList[0]?.commercialProvince?.idDyn}`}
                  onSelectionChange={(item) =>
                    handleInsuredProvinceChange(index, Number(item))
                  }
                >
                  {(item) => (
                    <AutocompleteItem key={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>
          </div>
        ))}
      </form>

      <div className="flex items-start mt-6">
        <div className="flex items-center h-5">
          <Checkbox
            isSelected={termsAndConditions}
            onValueChange={setTermsAndConditions}
            isRequired
          >
            Estoy de acuerdo con los{" "}
            <a href="#" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
