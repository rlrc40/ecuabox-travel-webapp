import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { CalculateYourInsuranceForm } from "@/models/calculate-your-insurance/calculate-your-insurance-form";

export default function TravelInsuranceSummary() {
  // Obtiene los valores del formulario desde sessionStorage
  const [formValue] = useSessionStorage<CalculateYourInsuranceForm>(
    "calculateYourInsuranceForm",
    {},
  );

  // Extrae los valores específicos del formulario
  const { startDate, endDate, origin, destination } = formValue;

  // Datos del seguro de viaje
  const insuranceData = {
    price: 299.99,
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
      <div className="text-gray-700">
        <p>
          <strong>Precio:</strong> ${insuranceData.price}
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
              <div key={categoryIndex}>
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
              </div>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
