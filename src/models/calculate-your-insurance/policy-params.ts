import type { Country } from "../country";

export type PolicyParams = {
  startDate?: string;
  endDate?: string;
  pax?: number;
  originCountry?: Country;
  destinationCountry?: Country;
  amount?: number;
};
