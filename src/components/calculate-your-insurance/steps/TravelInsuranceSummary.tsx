import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance-form";

export default function TravelInsuranceSummary() {
  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  console.log(formValue);

  const { startDate, endDate, pax, origin, destination } = formValue;

  const insuranceData = {
    price: 299.99,
    coverages: [
      { name: "Medical Emergency", amount: 100000 },
      { name: "Trip Cancellation", amount: 5000 },
      { name: "Lost Baggage", amount: 2000 },
      { name: "Flight Delay", amount: 1000 },
    ],
  };

  const { price, coverages } = insuranceData;

  const formattedStartDate =
    (startDate && new Date(startDate).toLocaleDateString()) || "";
  const formattedEndDate =
    (endDate && new Date(endDate).toLocaleDateString()) || "";

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Travel Insurance Summary
        </h2>
        <div className="mt-4 text-gray-700">
          <p>
            <strong>Price:</strong> ${price}
          </p>
          <p>
            <strong>Start Date:</strong> {formattedStartDate}
          </p>
          <p>
            <strong>End Date:</strong> {formattedEndDate}
          </p>
          <p>
            <strong>Origin:</strong> {origin}
          </p>
          <p>
            <strong>Destination:</strong> {destination}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Coverage
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {coverages.map((coverage) => (
              <tr key={coverage.name} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-sm text-gray-700">
                  {coverage.name}
                </td>
                <td className="py-2 px-4 text-sm text-gray-700">
                  ${coverage.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
