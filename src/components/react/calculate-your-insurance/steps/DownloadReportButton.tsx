import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";

export default function DownloadReportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [report, setReport] = useState<PolicyReport>();

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/indurances/report?id=7768`,
        );

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed fetch report data");
        }

        const data = await response.json();

        setReport(data.report);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <>
      {isLoading || !report ? (
        <a
          id="calculate-your-insurance-download-button"
          type="button"
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Procesando...
        </a>
      ) : (
        <a
          id="calculate-your-insurance-download-button"
          type="button"
          download={report.fileName}
          href={`data:application/pdf;base64,${report.base64File}`}
          className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
        >
          Descargar Poliza
        </a>
      )}
      {error && <p>Error: {error}</p>}
    </>
  );
}
