import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";
import { Button, Link } from "@heroui/react";
import useNewInsurance from "@/hooks/useNewInsurance";
import useDeviceDetection from "@/hooks/useDeviceDetection";

export default function DownloadReportButton() {
  const { create, isLoading, error } = useNewInsurance();

  const device = useDeviceDetection();

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
      {!error && (
        <Button
          fullWidth={device === "mobile"}
          isLoading={isLoading || !report}
          download={report?.fileName || ""}
          href={`data:application/pdf;base64,${report?.base64File || ""}`}
          as={Link}
          color="primary"
        >
          {isLoading || !report ? "Loading" : "Descargar Poliza"}
        </Button>
      )}
      {error && (
        <p>
          Ha habido un error al generar la poliza, por favor ponte en contacto
          con el soporte técnico, disculpa las molestias.
        </p>
      )}
    </>
  );
}
