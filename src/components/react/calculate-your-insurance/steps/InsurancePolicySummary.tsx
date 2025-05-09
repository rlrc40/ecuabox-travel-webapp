import useNewInsurance from "@/hooks/useNewInsurance";
import useTravelInsuranceSteps from "@/hooks/useTravelInsuranceSteps";
import { Accordion, AccordionItem } from "@heroui/react";
import { useEffect } from "react";

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

export default function InsurancePolicySummary() {
  const { policyParams, getInsurancePolicy, isLoading } =
    useTravelInsuranceSteps();

  const { initInsurance } = useNewInsurance();

  const { startDate, endDate, destinationCountry, originCountry } =
    policyParams;

  useEffect(() => {
    const prepareNewInsurance = async () => {
      const policy = await getInsurancePolicy();

      if (!policy) return;

      initInsurance({
        params: policyParams,
        policy,
      });
    };

    prepareNewInsurance();
  }, []);

  // Formatea las fechas de inicio y fin o asigna "N/A" si no están disponibles
  const formattedStartDate =
    (startDate && new Date(startDate).toLocaleDateString()) || "N/A";
  const formattedEndDate =
    (endDate && new Date(endDate).toLocaleDateString()) || "N/A";

  return (
    <div className="max-w-4xl mx-auto md:min-w-[600px] bg-white shadow-lg rounded-lg p-6 mt-8">
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
            <strong>Precio:</strong> ${policyParams.amount?.toFixed(2) || "N/A"}
          </p>
          <p>
            <strong>Fecha de Inicio:</strong> {formattedStartDate}
          </p>
          <p>
            <strong>Fecha de Fin:</strong> {formattedEndDate}
          </p>
          <p>
            <strong>Origen:</strong> {originCountry?.name || "N/A"}
          </p>
          <p>
            <strong>Destino:</strong> {destinationCountry?.name || "N/A"}
          </p>
        </div>
      )}
      <Accordion>
        <AccordionItem
          key="1"
          aria-label="Coberturas"
          title={
            <span className="text-gray-900 font-semibold">Más información</span>
          }
        >
          {/* Tabla de coberturas del seguro con agrupaciones */}
          <div className="overflow-x-auto bg-white shadow-md rounded-lg ">
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
        </AccordionItem>
      </Accordion>
    </div>
  );
}
