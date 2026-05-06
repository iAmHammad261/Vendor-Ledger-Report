import { create } from "zustand";
import type { VendorStore} from "../types/types";


const useVendorStore = create<VendorStore>((set) => ({
  selectedVendorId: null,
  selectedVendorName: null,
  selectedProjectId: null,
  selectedProjectName: null,
  pendingApprovalIncluded: false,
  retentionAccountIncluded: true,
  includePurchaseOrders: false,
  fromDate: null,
  toDate: null,
  setSelectedVendor: (id, name) => set({ selectedVendorId: id, selectedVendorName: name }),
  clearSelectedVendor: () => set({ selectedVendorId: null, selectedVendorName: null }),
  setSelectedProject: (id, name) => set({ selectedProjectId: id, selectedProjectName: name }),
  clearSelectedProject: () => set({ selectedProjectId: null, selectedProjectName: null }),
  setPendingApprovalIncluded: (included) => set({ pendingApprovalIncluded: included }),
  setRetentionAccountIncluded: (included) => set({ retentionAccountIncluded: included }),
  setIncludePurchaseOrders: (included) => set({ includePurchaseOrders: included }),
  setFromDate: (date) => set({ fromDate: date }),
  setToDate: (date) => set({ toDate: date }),
  
}));


export default useVendorStore;
