import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import type { Country } from "@/models/Country";

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

  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-4">
        <label
          htmlFor="origin"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select your origin
        </label>
        <select
          onChange={(e) =>
            setFormValue({ ...formValue, origin: e.target.value })
          }
          id="origin"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option>Choose a country</option>
          {countries?.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="destination"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select your destination
        </label>
        <select
          onChange={(e) =>
            setFormValue({ ...formValue, destination: e.target.value })
          }
          id="destination"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option>Choose a country</option>
          {countries?.map((country) => (
            <option key={country.id} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
