import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";
import type { Policy } from "@/models/policy";
import { useEffect, useState } from "react";

export default function TravelInsuranceSummary() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formValue, setFormValue] =
    useSessionStorage<CalculateYourInsuranceForm>(
      "calculateYourInsuranceForm",
      {},
    );

  const [policy, setPolicy] = useState<Policy>();

  const { startDate, endDate, origin, destination, pax } = formValue;

  useEffect(() => {
    const fetchInsuranceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const numberOfDays =
          startDate &&
          endDate &&
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          );
        const url =
          new URL(`${import.meta.env.PUBLIC_STRAPI_URL}/api/policies?`) +
          new URLSearchParams({
            numberOfDays: numberOfDays?.toString() || "0",
            numberOfPax: pax?.toString() || "0",
          }).toString();

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed fetch insurance data");
        }

        const data = await response.json();

        setPolicy(data.policy);
        setFormValue({ ...formValue, amount: data.policy.retailPriceAmount });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsuranceData();
  }, []);

  // Datos del seguro de viaje
  const insuranceData = {
    categories: [
      {
        title: "Garantías de asistencia - incluida cobertura covid-19",
        coverages: [
          { name: "Asistencia médica y sanitaria", amount: "30.000 €" },
          {
            name: "Repatriación o transporte sanitario de heridos o enfermos",
            amount: "Ilimitado",
          },
          {
            name: "Repatriación o transporte del asegurado fallecido",
            amount: "Ilimitado",
          },
        ],
      },
      {
        title: "Garantías de equipajes",
        coverages: [{ name: "Pérdidas materiales", amount: "300 €" }],
      },
      {
        title: "Garantías de responsabilidad civil",
        coverages: [
          { name: "Responsabilidad civil privada", amount: "12.000 €" },
        ],
      },
      {
        title: "Servicios incluidos",
        coverages: [
          { name: "Telemedicina", amount: "Incluido" },
          { name: "Servihelp", amount: "Incluido" },
          { name: "Servisuccess", amount: "Incluido" },
          { name: "Serviassist", amount: "Incluido" },
          { name: "Serviclaims", amount: "Incluido" },
        ],
      },
    ],
  };

  // Formatea las fechas de inicio y fin o asigna "N/A" si no están disponibles
  const formattedStartDate =
    (startDate && new Date(startDate).toLocaleDateString()) || "N/A";
  const formattedEndDate =
    (endDate && new Date(endDate).toLocaleDateString()) || "N/A";

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Resumen del Seguro de Viaje
      </h2>
      {isLoading ? (
        <div role="status" className="max-w-sm animate-pulse">
          <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
          <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="text-gray-700">
          <p>
            <strong>Precio:</strong> $
            {policy?.retailPriceAmount.toFixed(2) || "N/A"}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {formattedStartDate}
          </p>
          <p>
            <strong>Fecha de Fin:</strong> {formattedEndDate}
          </p>
          <p>
            <strong>Origen:</strong> {origin || "N/A"}
          </p>
          <p>
            <strong>Destino:</strong> {destination || "N/A"}
          </p>
        </div>
      )}

      {/* Tabla de coberturas del seguro con agrupaciones */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Coberturas
              </th>
              <th className="py-2 px-4 text-left text-sm font-semibold text-gray-700">
                Monto
              </th>
            </tr>
          </thead>
          <tbody>
            {insuranceData.categories.map((category, categoryIndex) => (
              <>
                <tr key={categoryIndex} className="bg-gray-200">
                  <td
                    colSpan={2}
                    className="py-2 px-4 font-semibold text-gray-900"
                  >
                    {category.title}
                  </td>
                </tr>
                {category.coverages.map((coverage, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 text-sm text-gray-700">
                      {coverage.name}
                    </td>
                    <td className="py-2 px-4 text-sm text-gray-700">
                      {coverage.amount}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
