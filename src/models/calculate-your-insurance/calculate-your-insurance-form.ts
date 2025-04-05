export type CalculateYourInsuranceForm = {
  startDate?: string;
  endDate?: string;
  pax?: number;
  destination?: string;
  origin?: string;
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    document?: string;
    email?: string;
    phone?: string;
    address?: string;
    termsAndConditions?: boolean;
  };
};
