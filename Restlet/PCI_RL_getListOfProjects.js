/**
 * @NScriptType Restlet
 * @NApiVersion 2.1
 */

const main = (query) => {
  const getProjectList = () => {
    let projectListSQL = `SELECT PRO.id as projectid, PRO.companyname as projectname FROM JOB as PRO WHERE PRO.companyname IS NOT NULL ORDER BY PRO.companyname`;

    try {
      let projectList = query
        .runSuiteQL({ query: projectListSQL })
        .asMappedResults();
      return {
        success: true,
        data: projectList,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const get = () => {

    const responseFromProject = getProjectList();

    return responseFromProject;

  };

  return {
    get,
  };
};

define(["N/query"], main);
