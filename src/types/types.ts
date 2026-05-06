interface VendorList {
  id: number;
  entityid: string;
}

interface ProjectList {
  projectid: number;
  projectname: string;
}


interface VendorLedgerData {
  id: number;
  trandate: string;
  typeid: string;
  type: string;
  documentnumber: string;
  transactionnumber: string;
  transstatus: string | null;
  projectid: number;
  project: string;
  account: string;
  vendor: string;
  memo: string | null;
  debit: number;
  credit: number;
  balance: string;
}

interface VendorStore {
  selectedVendorId: number | null;
  selectedVendorName: string | null;
  selectedProjectId: number | null;
  selectedProjectName: string | null;
  retentionAccountIncluded: boolean;
  pendingApprovalIncluded: boolean;
  includePurchaseOrders: boolean;
  fromDate: Date | null;
  toDate: Date | null;
  setSelectedVendor: (id: number, name: string) => void;
  clearSelectedVendor: () => void;
  setSelectedProject: (id: number, name: string) => void;
  clearSelectedProject: () => void;
  setPendingApprovalIncluded: (included: boolean) => void;
  setRetentionAccountIncluded: (included: boolean) => void;
  setIncludePurchaseOrders: (included: boolean) => void;
  setFromDate: (date: Date | null) => void;
  setToDate: (date: Date | null) => void;
}

export type { VendorList, ProjectList, VendorStore, VendorLedgerData };
