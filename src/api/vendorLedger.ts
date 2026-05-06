
import callRestlet from "../utility/callRestlet";

const getVendorLedger = async (vendorId: number, projectId: number | null, pendingApprovalIncluded: boolean, retentionAccountIncluded: boolean, purchaseOrderIncluded: boolean, fromDate: string | null, toDate: string | null) => {


    const VENDOR_LEDGER_RESTLET_ID = 1034;
    // const VENDOR_LEDGER_RESTLET_ID = 1011;


    const responseFromRestlet = await callRestlet(VENDOR_LEDGER_RESTLET_ID, 'POST', { vendorId, projectId, pendingApprovalIncluded, retentionAccountIncluded, purchaseOrderIncluded, fromDate, toDate });
    if(responseFromRestlet && responseFromRestlet.success){
        return responseFromRestlet.data;
    }
    else{
        console.error('Failed to fetch vendor ledger data', responseFromRestlet.message);
        return [];
    }

}

export default getVendorLedger;