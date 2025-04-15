export type CalculateYourInsuranceForm = {
  startDate?: string;
  endDate?: string;
  pax?: number;
  destination?: string;
  origin?: string;
  travelers?: Traveler[];
  amount?: number;
};

export type Traveler = {
  isHolder?: boolean;
  firstName?: string;
  lastName?: string;
  document?: string;
  birthdate?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  termsAndConditions?: boolean;
};
