import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import useVendorStore from "@/store/vendorLedgerStore";
export const PendingApprovalToggle = () => {
  const { pendingApprovalIncluded, setPendingApprovalIncluded } =
    useVendorStore();
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className="border-2 border-black"
        id="pending-approval-toggle"
        checked={pendingApprovalIncluded}
        onCheckedChange={setPendingApprovalIncluded}
      />
      <Label htmlFor="pending-approval-toggle">Include Pending Approval</Label>
    </div>
  );
};
