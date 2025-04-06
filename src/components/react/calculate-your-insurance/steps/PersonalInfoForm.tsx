import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import { useEffect, useState } from "react";

export default function PersonalInfoForm() {
  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const [documentError, setDocumentError] = useState<string | null>();

  const { personalInfo = {} } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormValue({
      ...formValue,
      personalInfo: {
        ...personalInfo,
        [id]:
          id === "termsAndConditions"
            ? !personalInfo.termsAndConditions
            : value,
      },
    });
  };

  const validateDocument = (document: string): boolean => {
    const dniRegex = /^\d{8}[A-HJ-NP-TV-Z]$/i; // DNI: 8 digits + 1 letter
    const nieRegex = /^[XYZ]\d{7}[A-HJ-NP-TV-Z]$/i; // NIE: starts with X, Y, or Z + 7 digits + 1 letter
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/i; // CIF: starts with a letter + 7 digits + 1 control character

    return (
      dniRegex.test(document) ||
      nieRegex.test(document) ||
      cifRegex.test(document)
    );
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (!validateDocument(value)) {
      setDocumentError(
        "Invalid document format. Please enter a valid DNI, NIE, or CIF.",
      );
    } else {
      setDocumentError(null);
    }

    setFormValue({
      ...formValue,
      personalInfo: {
        ...formValue?.personalInfo,
        [id]: value,
      },
    });
  };

  const disableNextStepButton = () => {
    const nextStepButton = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;
    if (nextStepButton) {
      nextStepButton.classList.replace("text-primary", "text-gray-400");
      nextStepButton.classList.replace("border-primary", "border-gray-400");
      nextStepButton.classList.add("pointer-events-none");
    }
  };

  const enableNextStepButton = () => {
    const nextStepButton = document.getElementById(
      "calculate-your-insurance-next-step-button",
    ) as HTMLButtonElement;
    if (nextStepButton) {
      nextStepButton.classList.replace("text-gray-400", "text-primary");
      nextStepButton.classList.replace("border-gray-400", "border-primary");
      nextStepButton.classList.remove("pointer-events-none");
    }
  };

  useEffect(() => {
    disableNextStepButton();
  }, [disableNextStepButton]);

  useEffect(() => {
    const { document, firstName, lastName, email, termsAndConditions } =
      personalInfo;

    if (document && firstName && lastName && email && termsAndConditions)
      enableNextStepButton();
  }, [formValue, enableNextStepButton]);

  return (
    <form>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            First name *
          </label>
          <input
            type="text"
            id="firstName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John"
            value={personalInfo.firstName || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Last name *
          </label>
          <input
            type="text"
            id="lastName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Doe"
            value={personalInfo.lastName || ""}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label
            htmlFor="document"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            ID Document *
          </label>
          <input
            type="text"
            id="document"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={personalInfo.document || ""}
            onChange={handleDocumentChange}
            required
          />
          {documentError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-500">
              {documentError}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Phone number
          </label>
          <input
            type="tel"
            id="phone"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="123-45-678"
            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
            value={personalInfo.phone || ""}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="email"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Email address *
        </label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="john.doe@company.com"
          value={personalInfo.email || ""}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="address"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Address
        </label>
        <input
          type="text"
          id="address"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={personalInfo.address || ""}
          onChange={handleChange}
        />
      </div>
      <div className="flex items-start mb-6">
        <div className="flex items-center h-5">
          <input
            id="termsAndConditions"
            type="checkbox"
            className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
            onChange={handleChange}
            checked={personalInfo.termsAndConditions || false}
            required
          />
        </div>
        <label
          htmlFor="remember"
          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          I agree with the{" "}
          <a
            href="#"
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            terms and conditions
          </a>
          .
        </label>
      </div>
    </form>
  );
}
