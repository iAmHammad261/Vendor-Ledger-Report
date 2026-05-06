import callRestlet from "@/utility/callRestlet";

const getProjectList = async () => {
  const PROJECT_LIST_RESTLET_ID = 1036;
  // const PROJECT_LIST_RESTLET_ID = 1009;



  const responseFromRestlet = await callRestlet(PROJECT_LIST_RESTLET_ID, "GET");

  console.log("Response from Restlet in getProjectList:", responseFromRestlet)

  if (responseFromRestlet && responseFromRestlet.success) {
    return [{ projectid: "", projectname: "" }, ...responseFromRestlet.data];
  }

  return [];
};

export default getProjectList;
