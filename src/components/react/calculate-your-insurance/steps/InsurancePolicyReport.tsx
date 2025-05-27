import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";
import { Button, Link } from "@heroui/react";
import useNewInsurance from "@/hooks/useNewInsurance";
import useDeviceDetection from "@/hooks/useDeviceDetection";
import PdfViewer from "@/components/ui/PdfViewer";
import LogoLoading from "../../ui/LogoLoading";

export default function InsurancePolicyReport() {
  const { create, isLoading, error } = useNewInsurance();

  const [loadingReport, setLoadingReport] = useState(true);

  const device = useDeviceDetection();

  const [report, setReport] = useState<PolicyReport>();

  useEffect(() => {
    const fetchReport = async () => {
      setLoadingReport(true);
      try {
        const report = await create();

        if (!report) {
          throw new Error("No report found");
        }

        setReport(report);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoadingReport(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <>
      {isLoading || loadingReport ? (
        <>
          <div className="mt-[50%]">
            <LogoLoading />
          </div>
        </>
      ) : (
        <>
          {report?.base64File && (
            <div className="mb-4">
              <PdfViewer base64Data={report.base64File} />
            </div>
          )}
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
        </>
      )}
    </>
  );
}
