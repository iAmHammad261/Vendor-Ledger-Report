import { useQuery } from '@tanstack/react-query';
import getVendorLedger from "../api/vendorLedger";
import useVendorStore from '../store/vendorLedgerStore';
import { convertDateIntoNetsuiteFormat } from '@/utility/convertDateIntoNetsuiteFormat';

const useVendorLedger = () => {
    const vendorId = useVendorStore((s) => s.selectedVendorId);
    const projectId = useVendorStore((s) => s.selectedProjectId);
    const pendingApprovalIncluded = useVendorStore((s) => s.pendingApprovalIncluded);
    const retentionAccountIncluded = useVendorStore((s) => s.retentionAccountIncluded);
    const includePurchaseOrders = useVendorStore((s) => s.includePurchaseOrders);
    const fromDate = useVendorStore((s) => s.fromDate);
    const toDate = useVendorStore((s) => s.toDate);

    console.log('useVendorLedger - vendorId:', vendorId, 'projectId:', projectId, 'pendingApprovalIncluded:', pendingApprovalIncluded, 'retentionAccountIncluded:', retentionAccountIncluded, 'includePurchaseOrders:', includePurchaseOrders, 'fromDate:', convertDateIntoNetsuiteFormat(fromDate), 'toDate:', convertDateIntoNetsuiteFormat(toDate));

    return useQuery({
        queryKey: ['vendorLedger', vendorId, projectId, pendingApprovalIncluded, retentionAccountIncluded, includePurchaseOrders, fromDate, toDate],
        queryFn: () => getVendorLedger(vendorId as number, projectId as number | null, pendingApprovalIncluded, retentionAccountIncluded, includePurchaseOrders, convertDateIntoNetsuiteFormat(fromDate), convertDateIntoNetsuiteFormat(toDate)),
        enabled: !!vendorId,
    });
};

export default useVendorLedger;