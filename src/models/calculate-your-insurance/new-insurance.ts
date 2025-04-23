interface Policy {
  idDyn: number;
  policyNumber: string;
  product: {
    idDyn: number;
    productName: string;
  };
}

interface Country {
  idDyn: number;
  name: string;
  isoCode2?: string;
  isoCode3?: string;
}

interface AddressInfo {
  commercialAddress?: string;
  commercialPostalCode?: string;
  commercialCountry?: Country;
  commercialProvince?: {
    idDyn: number;
    name: string;
  };
}

interface ContactInfo {
  phoneNumber?: string;
  web?: null | string;
  email?: string;
}

interface Insured {
  id?: null | number;
  version?: null | number;
  name?: string;
  surname?: string;
  treatment?: string;
  documentType?: string;
  documentNumber?: string;
  birthDate?: string;
  addressInfoList: AddressInfo[];
  contactInfoList: ContactInfo[];
}

export interface InsuranceInsured {
  isMainInsured: boolean;
  insured: Insured;
}

interface QuotePreset {
  paxNum: number;
  basePrices: { idDyn: number };
  priceListParamsValues1: { idDyn: number };
  priceListParamsValues2: { idDyn: number };
  insuredAmount: number;
  countryDestiny: Country;
  countryOrigin: Country;
}

export interface NewInsurance {
  unsuscribeDate?: string;
  effectDate?: string;
  policy?: Policy;
  quotePresetList?: QuotePreset[];
  insuranceInsuredList?: InsuranceInsured[];
}
