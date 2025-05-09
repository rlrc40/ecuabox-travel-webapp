import {
  DateRangePicker,
  Input,
  type DateValue,
  type RangeValue,
} from "@heroui/react";
import { useEffect } from "react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import PaxIconSVG from "../../ui/icons/PaxIconSVG";
import useTravelInsuranceSteps from "@/hooks/useTravelInsuranceSteps";
import useDeviceDetection from "@/hooks/useDeviceDetection";

export default function Step1Form() {
  const {
    policyParams,
    setPolicyDates,
    setPolicyPax,
    disableNextStepButton,
    enableNextStepButton,
  } = useTravelInsuranceSteps();

  const device = useDeviceDetection();

  const { startDate, endDate, pax } = policyParams;

  const handleApplyStretchOfDays = (value: RangeValue<DateValue> | null) => {
    if (!value) return;

    setPolicyDates(value.start.toString(), value.end.toString());
  };

  const handlePaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPolicyPax(parseInt(e.target.value));
  };

  const defaultDateRangeValue =
    startDate && endDate
      ? {
          start: parseDate(startDate),
          end: parseDate(endDate),
        }
      : null;

  useEffect(() => {
    disableNextStepButton();
  }, []);

  useEffect(() => {
    if (startDate && endDate && pax) enableNextStepButton();
    else disableNextStepButton();
  }, [policyParams, enableNextStepButton]);

  return (
    <>
      <DateRangePicker
        className="md:max-w-xs mb-4"
        label="Periodo de cobertura"
        aria-label="Periodo de cobertura"
        pageBehavior="single"
        minValue={today(getLocalTimeZone()).add({ days: 1 })}
        visibleMonths={device === "mobile" ? 1 : 2}
        defaultValue={defaultDateRangeValue}
        onChange={handleApplyStretchOfDays}
      />
      <Input
        type="number"
        id="travelers"
        placeholder="Número de viajeros"
        aria-describedby="Número de viajeros"
        aria-label="Número de viajeros"
        onChange={handlePaxChange}
        value={`${pax}`}
        startContent={<PaxIconSVG />}
        className="md:max-w-xs"
        required
      />
    </>
  );
}
