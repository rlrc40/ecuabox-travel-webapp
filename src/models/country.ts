export interface Country {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  capital: string;
  translations: Record<string, string>;
  provinces: Province[];
}

export interface Province {
  id: number;
  name: string;
}

export const EUROPEAN_COUNTRIES = [
  "AUSTRIA",
  "BELGIUM",
  "BULGARIA",
  "CROATIA",
  "CYPRUS",
  "CZECHIA",
  "DENMARK",
  "ESTONIA",
  "FINLAND",
  "FRANCE",
  "GERMANY",
  "GREECE",
  "HUNGARY",
  "IRELAND",
  "ITALY",
  "LATVIA",
  "LITHUANIA",
  "LUXEMBOURG",
  "MALTA",
  "NETHERLANDS",
  "POLAND",
  "PORTUGAL",
  "ROMANIA",
  "SLOVAKIA",
  "SLOVENIA",
  "SPAIN",
  "SWEDEN",
];
