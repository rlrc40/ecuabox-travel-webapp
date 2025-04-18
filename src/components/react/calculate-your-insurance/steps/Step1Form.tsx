import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import { StretchOfDaysSelector } from "../StretchOfDaysSelector";
import { useSessionStorage } from "@/hooks/useSessionStorage";

export default function Step1Form() {
  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const handleApplyStretchOfDays = ({
    startDate,
    endDate,
  }: {
    startDate: string;
    endDate: string;
  }) => {
    setFormValue({ ...formValue, startDate, endDate });
  };

  const handlePaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue({ ...formValue, pax: parseInt(e.target.value) });
  };

  return (
    <>
      <StretchOfDaysSelector apply={handleApplyStretchOfDays} />

      <div className="relative">
        <input
          type="number"
          id="travelers"
          placeholder="Travelers"
          aria-describedby="Number of travelers"
          onChange={handlePaxChange}
          className="h-12 bg-gray-50 border border-gray-300 pl-12 pr-4 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          required
        />

        <span className="absolute inset-y-0 flex h-12 w-12 items-center justify-center text-dark-5">
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </span>
      </div>
    </>
  );
}
