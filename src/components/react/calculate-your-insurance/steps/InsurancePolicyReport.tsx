import { useEffect, useState } from "react";
import type { PolicyReport } from "@/models/policy-report";
import { Button, Link } from "@heroui/react";
import useNewInsurance from "@/hooks/useNewInsurance";
import useDeviceDetection from "@/hooks/useDeviceDetection";
import PdfViewer from "@/components/ui/PdfViewer";
import LogoLoading from "../../ui/LogoLoading";
import useOrders from "@/hooks/useOrders";

export default function InsurancePolicyReport() {
  const { create, isLoading, error, paymentSessionId } = useNewInsurance();

  const { getOrder } = useOrders();

  const [loadingReport, setLoadingReport] = useState(true);

  const [paymentError, setPaymentError] = useState<string | null>(null);

  const device = useDeviceDetection();

  const [report, setReport] = useState<PolicyReport>();

  useEffect(() => {
    const fetchReport = async () => {
      setLoadingReport(true);
      try {
        const order = await fetchOrder();

        if (order?.paymentStatus !== "paid") {
          setPaymentError(
            "Ha ocurrido un error al procesar el pago, por favor ponte en contacto con el soporte técnico.",
          );

          setLoadingReport(false);

          throw new Error("Order not paid");
        }

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

    const fetchOrder = async () => {
      if (!paymentSessionId) {
        return;
      }
      try {
        return await getOrder(paymentSessionId);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchReport();
  }, []);

  return (
    <>
      {loadingReport ? (
        <>
          <div className="mt-[50%]">
            <LogoLoading />
          </div>
        </>
      ) : (
        <>
          {paymentError ? (
            <div className="mb-4 text-center text-red-500">
              <p>{paymentError}</p>
            </div>
          ) : null}
          {report?.base64File && (
            <div className="mb-4">
              <PdfViewer base64Data={report.base64File} />
            </div>
          )}
          {!error && !paymentError && (
            <Button
              fullWidth={device === "mobile"}
              isLoading={loadingReport}
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
