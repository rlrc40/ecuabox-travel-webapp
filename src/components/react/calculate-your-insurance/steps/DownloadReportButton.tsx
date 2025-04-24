import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";
import { Button, Link } from "@heroui/react";
import useNewInsurance from "@/hooks/useNewInsurance";

export default function DownloadReportButton() {
  const { create, isLoading, error } = useNewInsurance();

  const [report, setReport] = useState<PolicyReport>();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const report = await create();

        if (!report) {
          throw new Error("No report found");
        }

        setReport(report);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };

    fetchReport();
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
