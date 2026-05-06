import { VendorDropdown } from "./components/VendorDropdown";
import { ProjectDropdown } from "./components/ProjectDropdown";
import { PendingApprovalToggle } from "./components/PendingApprovalToggle";
import { RetentionAccountToggle } from "./components/RetentionAccountToggle";
import { IncludePurchaseOrders } from "./components/PurchaseOrderToggle";
import { DateRangePicker } from "./components/DatePicker";
import { ExcelExporter } from "./components/ExcelExporter";
import { PDFExporter } from "./components/PDFExporter";
import { IconUser } from '@tabler/icons-react';

import LedgerTable from "./components/VendorLedgerTable";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col gap-1.5 p-4">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 flex items-center justify-between">
          {" "}
          <div className="flex items-center gap-3">
          <IconUser className="w-8 h-8" />
          <h1 className="text-2xl font-semibold text-gray-800">Vendor Ledger</h1>
          </div>
          <div className="flex gap-1.5">
          <PDFExporter/>
          <ExcelExporter/>
          </div>
        </div>

        <div className="flex gap-1.5">
          <div className="flex w-full items-center bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Vendor</p>
              <VendorDropdown />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Project</p>
              <ProjectDropdown />
            </div>
            <div className="p-4 pt-10">
              <PendingApprovalToggle />
            </div>
            <div className="p-4 pt-10">
              <RetentionAccountToggle />
            </div>
            <div className="p-4 pt-10">
              <IncludePurchaseOrders />
            </div>
            <div>
              <DateRangePicker/>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm h-[calc(100vh-200px)]">
          <LedgerTable />
        </div>
      </div>
    </div>
  );
}

export default App;
