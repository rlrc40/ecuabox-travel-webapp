import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { useSessionStorage } from "./useSessionStorage";
import type { Policy } from "@/models/policy";
import type { NewInsurance } from "@/models/calculate-your-insurance/new-insurance";

const useNewInsurance = () => {
  const [newInsurance, setNewInsurance] = useSessionStorage<NewInsurance>(
    "new-insurance",
    {},
  );

  const initInsurance = ({
    params,
    policy,
  }: {
    params: PolicyParams;
    policy: Policy;
  }) => {
    if (!policy || !params) return;

    const { destinationCountry, originCountry, pax, startDate, endDate } =
      params;

    setNewInsurance({
      ...newInsurance,
      effectDate: startDate,
      unsuscribeDate: endDate,
      quotePresetList: [
        {
          paxNum: Number(pax),
          basePrices: { idDyn: policy.basePrices.idDyn },
          priceListParamsValues1: { idDyn: policy.priceListParamsValues1 },
          priceListParamsValues2: { idDyn: policy.priceListParamsValues2 },
          insuredAmount: policy.retailPriceAmount,
          countryDestiny: {
            idDyn: destinationCountry!.id,
            name: destinationCountry!.name,
            isoCode2: destinationCountry!.iso2,
            isoCode3: destinationCountry!.iso3,
          },
          countryOrigin: {
            idDyn: originCountry!.id,
            name: originCountry!.name,
            isoCode2: originCountry!.iso2,
            isoCode3: originCountry!.iso3,
          },
        },
      ],
      policy: {
        idDyn: policy.id,
        policyNumber: policy.name,
        product: {
          idDyn: policy.productId,
          productName: policy.productName,
        },
      },
    });
  };

  return {
    newInsurance,
    initInsurance,
  };
};

export default useNewInsurance;
