import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import type { NewInsurance } from "@/models/calculate-your-insurance/new-insurance";
import { Button, Link } from "@heroui/react";

export default function DownloadReportButton() {
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [newInsurance] = useSessionStorage<NewInsurance>("new-insurance", {});

  const [report, setReport] = useState<PolicyReport>();

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const createInsuranceUrl = new URL(
          `${import.meta.env.PUBLIC_STRAPI_URL}/api/insurances/new`,
        );

        const createResponse = await fetch(createInsuranceUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newInsurance),
        });

        if (!createResponse.ok) {
          throw new Error("Failed to create insurance");
        }

        const response = await createResponse.json();

        console.log("Insurance created:", response);

        setReport(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
    console.log(" NewInsurance", newInsurance);
  }, []);

  return (
    <>
      <Button
        isLoading={isLoading || !report}
        download={report?.fileName || ""}
        href={`data:application/pdf;base64,${report?.base64File || ""}`}
        as={Link}
        color="primary"
      >
        {isLoading || !report ? "Loading" : "Descargar Poliza"}
      </Button>
      {error && <p>Error: {error}</p>}
    </>
  );
}
