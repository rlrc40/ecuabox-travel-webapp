import fetchApi from "@/lib/strapi";

const useCountries = async () => {
  try {
    const response = await fetchApi({
      endpoint: "master-data/countries",
    });

    return { response };
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export default useCountries;
