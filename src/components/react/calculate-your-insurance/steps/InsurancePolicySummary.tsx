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
  const { policyParams, getInsurancePolicy, isLoading, setAmount } =
    useTravelInsuranceSteps();

  const { initInsurance } = useNewInsurance();

  const { startDate, endDate, destinationCountry, originCountry } =
    policyParams;

  useEffect(() => {
    const prepareNewInsurance = async () => {
      const policy = await getInsurancePolicy();

      if (!policy) return;

      setAmount(policy.retailPriceAmount);

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
    <div className="mx-auto w-full rounded-lg bg-white p-3 shadow-lg md:mt-8 md:max-w-4xl md:min-w-[600px]">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">
        Resumen del Seguro de Viaje
      </h2>

      {isLoading ? (
        <div role="status" className="max-w-sm animate-pulse">
          <div className="mb-4 h-2.5 w-48 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[330px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 max-w-[300px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
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
          <Accordion fullWidth={false}>
            <AccordionItem
              key="1"
              aria-label="Coberturas"
              title={
                <span className="font-semibold text-gray-900">
                  Más información
                </span>
              }
            >
              {/* Tabla de coberturas del seguro con agrupaciones */}
              <div className="overflow-x-auto rounded-lg bg-white shadow-md">
                <table className="table-auto md:min-w-full">
                  <thead className="border-b bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                        Coberturas
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
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
                            className="px-4 py-2 font-semibold text-gray-900"
                          >
                            {category.title}
                          </td>
                        </tr>
                        {category.coverages.map((coverage, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-700">
                              {coverage.name}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">
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
      )}
    </div>
  );
}
