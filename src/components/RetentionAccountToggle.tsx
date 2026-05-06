import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import useVendorStore from "@/store/vendorLedgerStore";

export const RetentionAccountToggle = () => {
  const { retentionAccountIncluded, setRetentionAccountIncluded } =
    useVendorStore();
  return (
    <div className="flex items-center gap-2">
      <Checkbox 
        className="border-2 border-black"
        id="retention-account-toggle"
        checked={retentionAccountIncluded}
        onCheckedChange={setRetentionAccountIncluded}
      />
      <Label htmlFor="retention-account-toggle">
        Include Retention Account
      </Label>
    </div>
  );
};
