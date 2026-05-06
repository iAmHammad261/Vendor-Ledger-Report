import callRestlet from "../utility/callRestlet";

const getVendorList = async () => {
  const VENDOR_LIST_RESTLET_ID = 1033;
  // const VENDOR_LIST_RESTLET_ID = 1010;


  const responseFromRestlet = await callRestlet(VENDOR_LIST_RESTLET_ID, "GET");

  if (responseFromRestlet && responseFromRestlet.success) {
    const data = responseFromRestlet.data;
    return data;
  }

  console.error("Failed to fetch vendor list data");
  return [];
};

export default getVendorList;
