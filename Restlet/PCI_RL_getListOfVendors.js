/**
 * @NScriptType Restlet
 * @NApiVersion 2.1
 */

/**
 * @author Muhammad Hammad
 * @since 26-04-2026
 * @description Uses SuiteQL to fetch the vendor id and entity id
 */

const main = (query) => {
  const getListOfVendors = () => {
    try {
      const sql = `SELECT V.id, V.entityid FROM VENDOR V`;

      const pagedResults = query.runSuiteQLPaged({
        query: sql,
        pageSize: 1000,
      });

      let finalResult = [];
      pagedResults.pageRanges.forEach((pageRange) => {
        const page = pagedResults.fetch({ index: pageRange.index });
        const data = page.data.asMappedResults();
        finalResult = finalResult.concat(data);
      });

      return {
        success: true,
        data: finalResult,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const get = () => {
    const getListVendorResponse = getListOfVendors();

    return getListVendorResponse;
  };

  return {
    get,
  };
};

define(["N/query"], main);
