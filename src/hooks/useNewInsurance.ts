import type { PolicyParams } from "@/models/calculate-your-insurance/policy-params";
import { useSessionStorage } from "./useSessionStorage";
import type { Policy } from "@/models/policy";
import type {
  InsuranceInsured,
  NewInsurance,
} from "@/models/calculate-your-insurance/new-insurance";
import type { DateValue } from "@internationalized/date";
import type { Country, Province } from "@/models/country";

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

  const initInsuranceInsured = (pax: number) => {
    if (!pax) return;

    const insuredList = newInsurance.insuranceInsuredList?.length
      ? newInsurance.insuranceInsuredList
      : Array.from({ length: pax || 1 }, (_, i) => ({
          isMainInsured: i === 0,
          insured: {
            name: "",
            surname: "",
            documentNumber: "",
            documentType: "Resto del mundo",
            birthDate: "",
            contactInfoList: [
              {
                email: "",
                phoneNumber: "",
                web: "",
              },
            ],
            addressInfoList: [
              {
                commercialAddress: "",
                commercialPostalCode: "",
              },
            ],
          },
        }));

    setNewInsurance({ ...newInsurance, insuranceInsuredList: insuredList });
  };

  const updateInsuranceInsured = (index: number, insured: InsuranceInsured) => {
    if (!newInsurance.insuranceInsuredList) return;

    const updatedInsuredList = [...newInsurance.insuranceInsuredList];
    updatedInsuredList[index] = insured;

    setNewInsurance({
      ...newInsurance,
      insuranceInsuredList: updatedInsuredList,
    });
  };

  const changeInsured = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    if (!newInsurance.insuranceInsuredList) return;

    const insuranceInsuredToUpdate = newInsurance.insuranceInsuredList[index];

    insuranceInsuredToUpdate.insured = {
      ...insuranceInsuredToUpdate.insured,
      [field]: value,
    };

    updateInsuranceInsured(index, insuranceInsuredToUpdate);
  };

  const changeInsuredAddress = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    if (!newInsurance.insuranceInsuredList) return;

    const insuranceInsuredToUpdate = newInsurance.insuranceInsuredList[index];

    insuranceInsuredToUpdate.insured.addressInfoList[0] = {
      ...insuranceInsuredToUpdate.insured.addressInfoList[0],
      [field]: value,
    };

    updateInsuranceInsured(index, insuranceInsuredToUpdate);
  };

  const changeInsuredContact = (
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    if (!newInsurance.insuranceInsuredList) return;

    const insuranceInsuredToUpdate = newInsurance.insuranceInsuredList[index];

    insuranceInsuredToUpdate.insured.contactInfoList[0] = {
      ...insuranceInsuredToUpdate.insured.contactInfoList[0],
      [field]: value,
    };

    updateInsuranceInsured(index, insuranceInsuredToUpdate);
  };

  const changeInsuredCountry = (index: number, country: Country) => {
    if (!newInsurance.insuranceInsuredList || !country) return;

    const insuranceInsuredToUpdate = newInsurance.insuranceInsuredList[index];

    insuranceInsuredToUpdate.insured.addressInfoList[0].commercialCountry = {
      idDyn: country.id,
      name: country.name,
      isoCode3: country.iso3,
    };

    updateInsuranceInsured(index, insuranceInsuredToUpdate);
  };

  const changeInsuredProvince = (index: number, province: Province) => {
    if (!newInsurance.insuranceInsuredList || !province) return;

    const insuranceInsuredToUpdate = newInsurance.insuranceInsuredList[index];

    insuranceInsuredToUpdate.insured.addressInfoList[0].commercialProvince = {
      idDyn: province.id,
      name: province.name,
    };

    updateInsuranceInsured(index, insuranceInsuredToUpdate);
  };

  return {
    newInsurance,
    initInsurance,
    initInsuranceInsured,
    updateInsuranceInsured,
    changeInsured,
    changeInsuredAddress,
    changeInsuredContact,
    changeInsuredCountry,
    changeInsuredProvince,
  };
};

export default useNewInsurance;
