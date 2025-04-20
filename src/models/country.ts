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
