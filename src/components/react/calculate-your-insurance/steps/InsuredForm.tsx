import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import type { Country, Province } from "@/models/country";
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
import type { NewInsurance } from "@/models/calculate-your-insurance/new-insurance";

interface InsuredFormProps {
  countries: Country[];
}

export default function InsuredForm({ countries }: InsuredFormProps) {
  const [newInsurance, setNewInsurance] = useSessionStorage<NewInsurance>(
    "new-insurance",
    {},
  );

  const [policyParams] = useSessionStorage<PolicyParams>("policy-params", {});

  const [documentError, setDocumentError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);

  const [provinces, setProvinces] = useState<Province[]>([]);

  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const { pax = 1 } = policyParams;

  const { insuranceInsuredList = [] } = newInsurance;

  const handleTravelerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value, type, checked } = e.target;
    const updatedInsuranceInsuredList = [...insuranceInsuredList];

    updatedInsuranceInsuredList[index].insured = {
      ...updatedInsuranceInsuredList[index].insured,
      [id]: type === "checkbox" ? checked : value,
    };

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });

    console.log("Updated insuranceInsuredList:", updatedInsuranceInsuredList);
  };

  const handleTravelerAddressChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;
    const updatedInsuranceInsuredList = [...insuranceInsuredList];

    updatedInsuranceInsuredList[index].insured.addressInfoList[0] = {
      ...updatedInsuranceInsuredList[index].insured.addressInfoList[0],
      [id]: value,
    };

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
    console.log("Updated insuranceInsuredList:", updatedInsuranceInsuredList);
  };

  const handleTravelerContactChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value } = e.target;
    const updatedInsuranceInsuredList = [...insuranceInsuredList];

    updatedInsuranceInsuredList[index].insured.contactInfoList[0] = {
      ...updatedInsuranceInsuredList[index].insured.contactInfoList[0],
      [id]: value,
    };

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
    console.log("Updated insuranceInsuredList:", updatedInsuranceInsuredList);
  };

  const handleTravelerBirthdateChange = (
    index: number,
    date: DateValue | null,
  ) => {
    if (!date) return;

    const updatedInsuranceInsuredList = [...insuranceInsuredList];
    updatedInsuranceInsuredList[index].insured = {
      ...updatedInsuranceInsuredList[index].insured,
      birthDate: date.toString(),
    };
    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
  };

  const handleTravelerCountryChange = (index: number, key: number) => {
    const updatedInsuranceInsuredList = [...insuranceInsuredList];
    const country = countries.find((c) => c.id === key);

    if (!country) return;

    updatedInsuranceInsuredList[
      index
    ].insured.addressInfoList[0].commercialCountry = {
      idDyn: country.id,
      name: country.name,
      isoCode3: country.iso3,
    };

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
    setProvinces(country.provinces || []);
  };

  const handleTravelerProvinceChange = (index: number, key: number) => {
    const updatedInsuranceInsuredList = [...insuranceInsuredList];
    const province = provinces.find((p) => p.id === key);

    if (!province) return;

    updatedInsuranceInsuredList[
      index
    ].insured.addressInfoList[0].commercialProvince = {
      idDyn: province.id,
      name: province.name,
    };

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
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

    if (!validateDocument(value)) {
      setDocumentError(`Formato de documento inválido.`);
    } else {
      setDocumentError(null);
    }

    const updatedInsuranceInsuredList = [...insuranceInsuredList];
    updatedInsuranceInsuredList[index].insured = {
      ...updatedInsuranceInsuredList[index].insured,
      [id]: value,
    };
    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuranceInsuredList,
    });
  };

  const disableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.replace("ui-button", "ui-button-disabled");
  };

  const enableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;

    if (btn) btn.classList.replace("ui-button-disabled", "ui-button");
  };

  useEffect(() => {
    const newTravelers = newInsurance.insuranceInsuredList?.length
      ? newInsurance.insuranceInsuredList
      : Array.from({ length: pax || 1 }, (_, i) => ({
          isMainInsured: i === 0,
          insured: {
            name: "",
            surname: "",
            documentNumber: "",
            documentType: "Resto del mundo",
            birthDate: "",
            contactInfoList: [
              {
                email: "",
                phoneNumber: "",
                web: "",
              },
            ],
            addressInfoList: [
              {
                commercialAddress: "",
                commercialPostalCode: "",
              },
            ],
          },
        }));
    setNewInsurance({ ...newInsurance, insuranceInsuredList: newTravelers });
  }, [pax]);

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

    if (allValid) enableNextStepButton();
    else disableNextStepButton();
    console.log(insuranceInsuredList);
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
                  onChange={(e) => handleTravelerChange(index, e)}
                  isRequired
                />
                <Input
                  id="surname"
                  label="Apellidos"
                  aria-label="Apellidos"
                  isRequired
                  value={insured.surname || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
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
                  onChange={(date) =>
                    handleTravelerBirthdateChange(index, date)
                  }
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
                  onChange={(e) => handleTravelerContactChange(index, e)}
                />
                <Input
                  type="email"
                  id="email"
                  label="Email"
                  aria-label="Email"
                  value={insured.contactInfoList[0].email || ""}
                  onChange={(e) => handleTravelerContactChange(index, e)}
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
                  onChange={(e) => handleTravelerAddressChange(index, e)}
                />
                <Input
                  id="commercialPostalCode"
                  label="Código Postal"
                  aria-label="Código Postal"
                  value={insured.addressInfoList[0].commercialPostalCode || ""}
                  onChange={(e) => handleTravelerAddressChange(index, e)}
                />
                <Autocomplete
                  id="country"
                  className="max-w-xs"
                  defaultItems={countries}
                  label="País"
                  aria-label="País"
                  defaultSelectedKey={`${insured.addressInfoList[0]?.commercialCountry?.idDyn}`}
                  onSelectionChange={(item) =>
                    handleTravelerCountryChange(index, Number(item))
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
                  defaultItems={
                    insured.addressInfoList[0]?.commercialProvince?.idDyn
                      ? countries.find(
                          (c) =>
                            c.id ===
                            insured.addressInfoList[0]?.commercialCountry
                              ?.idDyn,
                        )?.provinces
                      : provinces
                  }
                  label="Provincia"
                  aria-label="Provincia"
                  defaultSelectedKey={`${insured.addressInfoList[0]?.commercialProvince?.idDyn}`}
                  onSelectionChange={(item) =>
                    handleTravelerProvinceChange(index, Number(item))
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
