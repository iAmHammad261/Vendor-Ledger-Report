/**
 * @NScriptType Restlet
 * @NApiVersion 2.1
 */

/**
 * @author Muhammad Hammad
 * @since 26-Apr-2026
 */

const main = (query) => {
  const getBanksOfPayments = (vendorId) => {
    const sqlOfPayments = `SELECT
                  T.id,
                  (ACC.displaynamewithhierarchy) as account
                FROM TRANSACTION T
                  INNER JOIN TRANSACTIONLINE TL ON (TL.transaction = T.id AND TL.taxline = 'F')
                  INNER JOIN TRANSACTIONACCOUNTINGLINE TAL ON ( TL.transaction = TAL.transaction AND TAL.transaction = T.id)
                  LEFT JOIN ACCOUNT ACC ON (ACC.id = TAL.account) 
                  WHERE TL.entity = '${vendorId}' AND T.type IN ('VendPymt', 'VPrep', 'Journal') AND (ACC.parent IN ('3151', '4613', '4526', '4612', '4615', '3152', '3051', '3174', '4366'))
                  AND REGEXP_REPLACE(BUILTIN.DF(T.status), '^[^:]*:\\s*', '') NOT IN ('Rejected', 'Voided', 'Cancelled') AND T.isreversal = 'F' AND T.reversal IS NULL 
                ORDER BY 
                  T.id`;

    let finalResults = [];

    const resultPaged = query.runSuiteQLPaged({
      query: sqlOfPayments,
      pageSize: 1000,
    });

    resultPaged.pageRanges.forEach((pageRange) => {
      const page = resultPaged.fetch({ index: pageRange.index });
      finalResults = finalResults.concat(page.data.asMappedResults());
    });

    let preparedData = {};

    finalResults.forEach((result) => {
      preparedData[result.id] = result.account;
    });

    return preparedData;
  };

  const swapPaymentsAccount = (ledgerData, paymentMap) => {
    return ledgerData.map((entry) => {
      let transactionId = entry.id;

      if (paymentMap[transactionId]) {
        return {
          ...entry,
          account: paymentMap[transactionId],
        };
      }

      return entry;
    });
  };

  const addRunningBalance = (ledgerData) => {
    let runningBalance = 0;
    return ledgerData.map((entry) => {
      runningBalance += parseFloat(entry.debit) - parseFloat(entry.credit);
      return {
        ...entry,
        balance: runningBalance.toFixed(2),
      };
    });
  };

  const prepareSQL = (
    vendorId,
    projectId,
    pendingApprovalIncluded,
    retentionAccountIncluded,
    purchaseOrderIncluded,
    fromDate,
    toDate,
  ) => {
    let whereClause = "";

    let entityClause = ` WHERE TL.entity = '${vendorId}'`;

    whereClause += entityClause;

    let projectClause = projectId ? ` AND T.custbody1 = '${projectId}'` : "";

    whereClause += projectClause;

    let typeExclusionClause = ` AND T.type NOT IN ('VendRfq', 'PurchCon', 'PurchOrd', 'ItemRcpt', 'SysJrnl')`;

    if (purchaseOrderIncluded)
      typeExclusionClause = ` AND T.type NOT IN ('VendRfq', 'PurchCon', 'ItemRcpt', 'SysJrnl')`;

    whereClause += typeExclusionClause;

    let defaultAccountFilters = ["4452", "4415", "4400", "4547"];

    if (!retentionAccountIncluded)
      defaultAccountFilters = defaultAccountFilters.slice(0, 2);

    if (purchaseOrderIncluded) defaultAccountFilters.push("116");

    let AccountClause = `AND (ACC.parent = '3154' OR ACC.parent = '3187' OR TAL.account IN (${defaultAccountFilters.map((acc) => `'${acc}'`).join(",")}))`;

    whereClause += AccountClause;

    if (fromDate) whereClause += ` AND T.trandate >= '${fromDate}' `;

    if (toDate) whereClause += ` AND T.trandate <= '${toDate}' `;

    let transactionStatusExclusionClause = ` AND REGEXP_REPLACE(BUILTIN.DF(T.status), '^[^:]*:\\s*', '') NOT IN ('Rejected', 'Voided', 'Cancelled') AND T.isreversal = 'F' AND T.reversal IS NULL AND REGEXP_REPLACE(BUILTIN.DF(T.status), '^[^:]*:\\s*', '') <> 'Pending Approval'`;

    if (pendingApprovalIncluded)
      transactionStatusExclusionClause = ` AND REGEXP_REPLACE(BUILTIN.DF(T.status), '^[^:]*:\\s*', '') NOT IN ('Rejected', 'Voided', 'Cancelled') AND T.isreversal = 'F' AND T.reversal IS NULL`;

    whereClause += transactionStatusExclusionClause;


    let debitAndCreditBothZeroExclusionClause = ` AND (COALESCE(TAL.debit,0) <> 0 OR CASE WHEN T.type = 'PurchOrd' THEN COALESCE(T.amountunbilled,0) ELSE COALESCE(TAL.credit,0) END <> 0)`;

    whereClause += debitAndCreditBothZeroExclusionClause;

    const remainingSQL = `
        SELECT
            T.id,
            T.trandate,
            LOWER(T.type) as typeId,
            BUILTIN.DF(T.type) as type,
            T.tranid as documentnumber,
            T.transactionnumber,
            CASE WHEN REGEXP_SUBSTR(BUILTIN.DF(T.status), '[^:]+$') LIKE '%Undefined%' THEN '' ELSE REGEXP_SUBSTR(BUILTIN.DF(T.status), '[^:]+$') END AS transstatus,
            T.custbody1 as projectid,
            BUILTIN.DF(T.custbody1) as project,
            (ACC.displaynamewithhierarchy) as account,
            BUILTIN.DF(TL.entity) as vendor, 
            T.memo as memo,
            COALESCE(TAL.debit,0) as debit,
            CASE WHEN T.type = 'PurchOrd' THEN COALESCE(-1*T.amountunbilled,0) ELSE COALESCE(TAL.credit,0) END as credit
        FROM TRANSACTION T
        INNER JOIN TRANSACTIONLINE TL ON (TL.transaction = T.id AND TL.taxline = 'F')
        INNER JOIN TRANSACTIONACCOUNTINGLINE TAL ON ( TL.transaction = TAL.transaction AND TAL.transaction = T.id AND TAL.transactionline = TL.id)
        LEFT JOIN ACCOUNT ACC ON (ACC.id = TAL.account) `;

    let orderByClause = ` ORDER BY T.trandate`;

    const finalSQL = remainingSQL + whereClause + orderByClause;

    return finalSQL;
  };

  const getVendorLedger = (
    vendorId,
    projectId,
    pendingApprovalIncluded,
    retentionAccountIncluded,
    purchaseOrderIncluded,
    fromDate,
    toDate,
  ) => {
    try {
      const sql = prepareSQL(
        vendorId,
        projectId,
        pendingApprovalIncluded,
        retentionAccountIncluded,
        purchaseOrderIncluded,
        fromDate,
        toDate,
      );

      const resultPaged = query.runSuiteQLPaged({
        query: sql,
        pageSize: 1000,
      });

      let results = [];

      resultPaged.pageRanges.forEach((pageRange) => {
        const page = resultPaged.fetch({ index: pageRange.index });
        results = results.concat(page.data.asMappedResults());
      });

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const post = (requestBody) => {
    const {
      vendorId,
      projectId,
      pendingApprovalIncluded,
      retentionAccountIncluded,
      purchaseOrderIncluded,
      fromDate,
      toDate,
    } = requestBody;
    const response = getVendorLedger(
      vendorId,
      projectId,
      pendingApprovalIncluded,
      retentionAccountIncluded,
      purchaseOrderIncluded,
      fromDate,
      toDate,
    );

    if (response.success) {
      const vendorLedgerWithRunningBalance = addRunningBalance(response.data);
      const vendorLedgerWithSwappedAccounts = swapPaymentsAccount(
        vendorLedgerWithRunningBalance,
        getBanksOfPayments(vendorId),
      );
      return {
        success: true,
        data: vendorLedgerWithSwappedAccounts,
      };
    }

    return {
      success: false,
      message: response.message,
    };
  };

  return {
    post,
  };
};

define(["N/query"], main);
