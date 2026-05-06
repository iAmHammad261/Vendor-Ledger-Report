import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import useVendorStore from "../store/vendorLedgerStore";

export const IncludePurchaseOrders = () => {
  const { includePurchaseOrders, setIncludePurchaseOrders } = useVendorStore();

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        className="border-2 border-black"
        id="include-purchase-orders-toggle"
        checked={includePurchaseOrders}
        onCheckedChange={setIncludePurchaseOrders}
      />
      <Label htmlFor="include-purchase-orders-toggle">
        Include Purchase Orders
      </Label>
    </div>
  );
};

