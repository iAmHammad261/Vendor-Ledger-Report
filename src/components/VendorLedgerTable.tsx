import { useMemo } from "react";
import { Inbox as InboxIcon, UserSearch } from "lucide-react";
import useVendorStore from "@/store/vendorLedgerStore";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, AccessorKeyColumnDef } from "@tanstack/react-table";
import useVendorLedger from "../hooks/useVendorLedger";

const formatCurrency = (value: unknown) => {
  if (value === null || value === undefined || value === "") return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
};

type VendorLedgerRow = NonNullable<
  ReturnType<typeof useVendorLedger>["data"]
>[number];

const columns: ColumnDef<VendorLedgerRow>[] = [
  { accessorKey: "trandate", header: "Date", size: 9 },
  { accessorKey: "type", header: "Type", size: 9 },
  {
    accessorKey: "documentnumber",
    header: "Doc. #",
    size: 9,
    cell: ({ getValue, row }) => (
      <a
        href={`/app/accounting/transactions/${row.original.typeid}.nl?id=${row.original.id}`}
        target="_blank"
        className="text-blue-600 hover:underline"
      >
        {getValue() as string}
      </a>
    ),
  },
  {
    accessorKey: "transactionnumber",
    header: "Trans. #",
    size: 9,
    cell: ({ getValue, row }) => (
      <a
        href={`/app/accounting/transactions/${row.original.typeid}.nl?id=${row.original.id}`}
        target="_blank"
        className="text-blue-600 hover:underline"
      >
        {getValue() as string}
      </a>
    ),
  },
  // { accessorKey: "transstatus", header: "Status", size: 8 },
  { accessorKey: "project", header: "Project", size: 8 },
  { accessorKey: "account", header: "Account", size: 12 },
  { accessorKey: "memo", header: "Memo", size: 12 },
  {
    accessorKey: "debit",
    header: "Debit",
    cell: ({ getValue }) => formatCurrency(getValue()),
    size: 8,
    meta: { align: "right" },
  },
  {
    accessorKey: "credit",
    header: "Credit",
    cell: ({ getValue }) => formatCurrency(getValue()),
    size: 8,
    meta: { align: "right" },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ getValue }) => formatCurrency(getValue()),
    size: 8,
    meta: { align: "right" },
  },
];

const getAlign = (meta: unknown): "left" | "right" | "center" => {
  if (meta && typeof meta === "object" && "align" in meta) {
    return (meta as { align: "left" | "right" | "center" }).align;
  }
  return "left";
};

const LedgerTable = () => {
  const { data, isLoading } = useVendorLedger();
  const selectedVendorName = useVendorStore(
    (state) => state.selectedVendorName,
  );
  console.log("Vendor Ledger Data:", data);
  const tableData = useMemo(() => data ?? [], [data]);
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const totals = useMemo(() => {
    const debit = tableData.reduce(
      (sum: number, row: VendorLedgerRow) => sum + (Number(row.debit) || 0),
      0,
    );
    const credit = tableData.reduce(
      (sum: number, row: VendorLedgerRow) => sum + (Number(row.credit) || 0),
      0,
    );
    return { debit, credit, balance: debit - credit };
  }, [tableData]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "separate",
            tableLayout: "fixed",
            fontSize: "12px",
            border: "1px solid #e5e7eb",
            // overflow: "hidden",
            height: "100%",
            flex: 1,
            // padding: "12px"
          }}
        >
          <thead className="top-0 bg-white z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    style={{
                      textAlign: getAlign(header.column.columnDef.meta),
                      borderBottom: "1px solid #e5e7eb",
                      width: `${header.column.columnDef.size}%`,
                      borderRight:
                        index === headerGroup.headers.length - 1
                          ? "none"
                          : "1px solid #e5e7eb",
                      padding: "8px 12px",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#ffffff",
                      zIndex: 10,
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody style={{ height: "100%" }}>
            {isLoading &&
              Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => {
                    const key = (col as AccessorKeyColumnDef<VendorLedgerRow>)
                      .accessorKey as string;
                    return (
                      <td
                        key={key}
                        style={{
                          borderBottom: "1px solid #e5e7eb",
                          borderRight: "1px solid #e5e7eb",
                          padding: "8px 12px",
                          width: `${col.size}%`,
                        }}
                      >
                        <Skeleton className="h-4 w-full" />
                      </td>
                    );
                  })}
                </tr>
              ))}

            {!isLoading &&
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      key={cell.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        textAlign: getAlign(cell.column.columnDef.meta),
                        width: `${cell.column.columnDef.size}%`,
                        borderRight:
                          index === row.getVisibleCells().length - 1
                            ? "none"
                            : "1px solid #e5e7eb",
                        padding: "8px 12px",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  {selectedVendorName ? (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <InboxIcon className="w-8 h-8" />
                      <span className="text-sm font-medium">No data found</span>
                      <span className="text-xs">
                        There are no records to display for{" "}
                        <strong>{selectedVendorName}</strong>.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                      <UserSearch className="w-8 h-8" />
                      <span className="text-sm font-medium">
                        No vendor selected
                      </span>
                      <span className="text-xs">
                        Please select a vendor to view their ledger.
                      </span>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              {columns.map((col, index) => {
                const key = (col as AccessorKeyColumnDef<VendorLedgerRow>)
                  .accessorKey as string;
                const align = getAlign(col.meta);

                let content: React.ReactNode = null;
                if (key === "trandate") content = "Total";
                if (key === "debit") content = formatCurrency(totals.debit);
                if (key === "credit") content = formatCurrency(totals.credit);
                if (key === "balance") content = formatCurrency(totals.balance);

                return (
                  <td
                    key={key}
                    style={{
                      backgroundColor: "#f9fafb",
                      borderRight:
                        index === columns.length - 1
                          ? "none"
                          : "1px solid #e5e7eb",
                      padding: "8px 12px",
                      textAlign: align,
                      fontWeight: content ? 600 : 400,
                      fontSize: "12px",
                      width: `${col.size}%`,
                      borderTop: "1px solid #e5e7eb",
                      position: "sticky", 
                      bottom: 0, 
                      zIndex: 10,
                      color:
                        key === "balance"
                          ? totals.balance < 0
                            ? "#dc2626"
                            : "#16a34a"
                          : "#111827",
                    }}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;
