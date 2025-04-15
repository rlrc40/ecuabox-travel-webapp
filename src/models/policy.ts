export type Policy = {
  id: number;
  name: string;
  productId: number;
  productName: string;
  netPremiumAmount: number; // The base insurance premium – the cost of the insurance coverage excluding commissions, fees, or taxes.
  netRetailPrice: number; // The net retail price – the selling price before taxes, including commissions and additional fees.
  paxRetailPrice: number; // Retail price per traveler – the total retail price divided by the number of travelers (pax).
  retailPriceAmount: number; //Total retail price – the final amount paid by the customer, including all taxes.
};
