import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import {
  Checkbox,
  DatePicker,
  Input,
  Tab,
  Tabs,
  type DateValue,
} from "@heroui/react";
import { useEffect, useState } from "react";

const parseDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

export default function TravelersForm() {
  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const [documentError, setDocumentError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const { travelers = [], pax = 1 } = formValue;

  useEffect(() => {
    if (!Array.isArray(travelers) || travelers.length !== pax) {
      const newTravelers = Array.from({ length: pax || 1 }, (_, i) => ({
        isHolder: i === 0,
      }));
      setFormValue({ ...formValue, travelers: newTravelers });
    }
  }, [pax]);

  const handleTravelerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { id, value, type, checked } = e.target;
    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [id]: type === "checkbox" ? checked : value,
    };
    setFormValue({ ...formValue, travelers: updatedTravelers });
    console.log("Updated travelers:", updatedTravelers);
  };

  const handleTravelerBirthdateChange = (
    index: number,
    date: DateValue | null,
  ) => {
    if (!date) return;

    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      birthdate: date ? parseDate(date.toString()) : "",
    };
    setFormValue({ ...formValue, travelers: updatedTravelers });
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
      setDocumentError(
        "Formato de documento inválido. Por favor, ingrese un DNI, NIE o CIF válido.",
      );
    } else {
      setDocumentError(null);
    }

    const updatedTravelers = [...travelers];
    updatedTravelers[index] = {
      ...updatedTravelers[index],
      [id]: value,
    };
    setFormValue({ ...formValue, travelers: updatedTravelers });
  };

  const disableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;
    if (btn) {
      btn.classList.replace("text-primary", "text-gray-400");
      btn.classList.replace("border-primary", "border-gray-400");
      btn.classList.add("pointer-events-none");
    }
  };

  const enableNextStepButton = () => {
    const btn = document.getElementById(
      "calculate-your-insurance-payment-button",
    ) as HTMLButtonElement;
    if (btn) {
      btn.classList.replace("text-gray-400", "text-primary");
      btn.classList.replace("border-gray-400", "border-primary");
      btn.classList.remove("pointer-events-none");
    }
  };

  useEffect(() => {
    disableNextStepButton();
  }, []);

  useEffect(() => {
    const allValid = travelers.every(
      (t) =>
        t.document &&
        t.firstName &&
        t.lastName &&
        t.email &&
        t.birthdate &&
        t.termsAndConditions,
    );
    if (allValid) enableNextStepButton();
    else disableNextStepButton();
  }, [formValue.travelers]);

  return (
    <div>
      <div className="tabs flex space-x-4 mb-6">
        <Tabs
          aria-label="Viajeros"
          radius="full"
          onSelectionChange={(index) => setActiveTab(Number(index))}
        >
          {travelers.map((_, index) => (
            <Tab
              key={index}
              title={`Viajero ${index + 1}`}
              onClick={() => setActiveTab(index)}
            />
          ))}
        </Tabs>
      </div>
      <form>
        {travelers.map((traveler, index) => (
          <div
            key={index}
            className={`tab-content ${activeTab === index ? "block" : "hidden"}`}
          >
            <div className="mb-10 border p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4">
                Viajero {index + 1} {traveler.isHolder && "(Titular)"}
              </h2>

              {/* General Data */}
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Input
                  id="firstName"
                  label="Nombre"
                  aria-label="Nombre"
                  value={traveler.firstName || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                  isRequired
                />
                <Input
                  id="lastName"
                  label="Apellidos"
                  aria-label="Apellidos"
                  isRequired
                  value={traveler.lastName || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                />
                <Input
                  id="document"
                  label="Documento de Identidad"
                  aria-label="Documento de Identidad"
                  placeholder="DNI, NIE o CIF"
                  value={traveler.document || ""}
                  onChange={(e) => handleDocumentChange(index, e)}
                  isRequired
                  isInvalid={!!documentError}
                  errorMessage={documentError}
                />
                <DatePicker
                  className="max-w-[284px]"
                  label="Fecha de Nacimiento"
                  aria-label="Fecha de Nacimiento"
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
                  id="phone"
                  label="Teléfono"
                  aria-label="Teléfono"
                  value={traveler.phone || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                />
                <Input
                  type="email"
                  id="email"
                  label="Email"
                  aria-label="Email"
                  value={traveler.email || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                  isRequired
                />
              </div>

              {/* Address Data */}
              <h3 className="text-md font-semibold mb-2">Dirección</h3>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <Input
                  id="address"
                  label="Dirección"
                  aria-label="Dirección"
                  value={traveler.address || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                />
                <Input
                  id="postalCode"
                  label="Código Postal"
                  aria-label="Código Postal"
                  value={traveler.postalCode || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                />
                <Input
                  id="city"
                  label="Ciudad"
                  aria-label="Ciudad"
                  value={traveler.city || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <Checkbox defaultSelected isRequired>
                    Estoy de acuerdo con los{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      términos y condiciones
                    </a>
                  </Checkbox>
                </div>
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}
