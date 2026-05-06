import getVendorList from "../api/vendorList";
import type {VendorList} from "../types/types"
import { useState, useEffect } from "react";

const useVendorList = () => {
  const [vendorList, setVendorList] = useState<VendorList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getVendorList();
        setVendorList(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return { vendorList, loading, error };
};

export default useVendorList;
