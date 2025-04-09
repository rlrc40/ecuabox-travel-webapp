import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import { useEffect, useState } from "react";

const inputClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500";

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
        {travelers.map((_, index) => (
          <button
            key={index}
            className={`tab px-4 py-2 rounded-lg font-medium ${
              activeTab === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(index)}
          >
            Viajero {index + 1}
          </button>
        ))}
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
                <div>
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={traveler.firstName || ""}
                    onChange={(e) => handleTravelerChange(index, e)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={traveler.lastName || ""}
                    onChange={(e) => handleTravelerChange(index, e)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="document"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Documento de Identidad *
                  </label>
                  <input
                    type="text"
                    id="document"
                    value={traveler.document || ""}
                    onChange={(e) => handleDocumentChange(index, e)}
                    required
                    className={inputClass}
                  />
                  {documentError && (
                    <p className="mt-2 text-sm text-red-600">{documentError}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="birthdate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    id="birthdate"
                    value={traveler.birthdate || ""}
                    onChange={(e) => handleTravelerChange(index, e)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Contact Data */}
              <h3 className="text-md font-semibold mb-2">Datos de Contacto</h3>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={traveler.phone || ""}
                    onChange={(e) => handleTravelerChange(index, e)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={traveler.email || ""}
                    onChange={(e) => handleTravelerChange(index, e)}
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Address Data */}
              <h3 className="text-md font-semibold mb-2">Dirección</h3>
              <div className="mb-4">
                <label
                  htmlFor="address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  id="address"
                  value={traveler.address || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                  className={inputClass}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="postalCode"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Código Postal
                </label>
                <input
                  type="text"
                  id="postalCode"
                  value={traveler.postalCode || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                  className={inputClass}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="city"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Ciudad
                </label>
                <input
                  type="text"
                  id="city"
                  value={traveler.city || ""}
                  onChange={(e) => handleTravelerChange(index, e)}
                  className={inputClass}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="termsAndConditions"
                    type="checkbox"
                    onChange={(e) => handleTravelerChange(index, e)}
                    checked={traveler.termsAndConditions || false}
                    required
                    className="w-4 h-4"
                  />
                </div>
                <label htmlFor="termsAndConditions" className="ml-2 text-sm">
                  Estoy de acuerdo con los{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    términos y condiciones
                  </a>
                  .
                </label>
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}
