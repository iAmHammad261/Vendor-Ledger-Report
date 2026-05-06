import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import useVendorStore from "@/store/vendorLedgerStore";
import useVendorLedger from "../hooks/useVendorLedger";
import type { VendorLedgerData } from "@/types/types";

const HEADER_COLOR = "4A90D9";
const TOTAL_ROW_COLOR = "F3F4F6";
const POSITIVE_COLOR = "16A34A";
const NEGATIVE_COLOR = "DC2626";

const COLUMNS = [
  { header: "Date",         key: "trandate",           width: 14 },
  { header: "Type",         key: "type",               width: 14 },
  { header: "Doc. #",       key: "documentnumber",     width: 16 },
  { header: "Trans. #",     key: "transactionnumber",  width: 16 },
  { header: "Status",       key: "transstatus",        width: 14 },
  { header: "Project",      key: "project",            width: 16 },
  { header: "Account",      key: "account",            width: 20 },
  { header: "Memo",         key: "memo",               width: 20 },
  { header: "Debit",        key: "debit",              width: 16 },
  { header: "Credit",       key: "credit",             width: 16 },
  { header: "Balance",      key: "balance",            width: 16 },
];

export const useExcelExporter = () => {
  const selectedVendorName = useVendorStore((state) => state.selectedVendorName);
  const { data } = useVendorLedger();

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Vendor Ledger App";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Vendor Ledger", {
      pageSetup: { orientation: "landscape", fitToPage: true },
    });

    // ── Title rows ────────────────────────────────────────────────
    sheet.mergeCells("A1:K1");
    const titleCell = sheet.getCell("A1");
    titleCell.value = "Vendor Ledger";
    titleCell.font = { name: "Arial", size: 16, bold: true };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(1).height = 28;

    sheet.mergeCells("A2:K2");
    const vendorCell = sheet.getCell("A2");
    vendorCell.value = selectedVendorName ?? "Al Rehan Dynamic Contractor";
    vendorCell.font = { name: "Arial", size: 13 };
    vendorCell.alignment = { horizontal: "center", vertical: "middle" };
    sheet.getRow(2).height = 22;

    // ── Empty spacer row ──────────────────────────────────────────
    sheet.addRow([]);

    // ── Column definitions ────────────────────────────────────────
    sheet.columns = COLUMNS.map((col) => ({
      key: col.key,
      width: col.width,
    }));

    // ── Header row ────────────────────────────────────────────────
    const headerRow = sheet.addRow(COLUMNS.map((c) => c.header));
    headerRow.height = 20;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${HEADER_COLOR}` },
      };
      cell.font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: false };
      cell.border = {
        top:    { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        left:   { style: "thin", color: { argb: "FFD1D5DB" } },
        right:  { style: "thin", color: { argb: "FFD1D5DB" } },
      };
    });

    // ── Data rows ─────────────────────────────────────────────────
    const currencyFmt = '#,##0.00';
    const validRows = data.filter((row: VendorLedgerData) => row != null && row.id != null);

    validRows.forEach((row : VendorLedgerData) => {
      const dataRow = sheet.addRow({
        trandate:          row.trandate          ?? "-",
        type:              row.type              ?? "-",
        documentnumber:    row.documentnumber    ?? "-",
        transactionnumber: row.transactionnumber ?? "-",
        transstatus:       row.transstatus       ?? "-",
        project:           row.project           ?? "-",
        account:           row.account           ?? "-",
        memo:              row.memo              ?? "-",
        debit:             Number(row.debit)     || 0,
        credit:            Number(row.credit)    || 0,
        balance:           Number(row.balance)   || 0,
      });

      dataRow.height = 16;

      // Right-align and format currency columns
      (["debit", "credit", "balance"] as const).forEach((key) => {
        const cell = dataRow.getCell(key);
        cell.numFmt = currencyFmt;
        cell.alignment = { horizontal: "right" };
      });

      // Border on all cells
      dataRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.font = { name: "Arial", size: 8 };
        cell.border = {
          top:    { style: "hair", color: { argb: "FFD1D5DB" } },
          bottom: { style: "hair", color: { argb: "FFD1D5DB" } },
          left:   { style: "hair", color: { argb: "FFD1D5DB" } },
          right:  { style: "hair", color: { argb: "FFD1D5DB" } },
        };
      });
    });

    // ── Totals row ────────────────────────────────────────────────
    const totalDebit   = validRows.reduce((s: number, r: VendorLedgerData) => s + (Number(r.debit)   || 0), 0);
    const totalCredit  = validRows.reduce((s: number, r: VendorLedgerData) => s + (Number(r.credit)  || 0), 0);
    const totalBalance = totalDebit - totalCredit;

    const totalsRow = sheet.addRow({
      trandate: "TOTAL",
      debit:    totalDebit,
      credit:   totalCredit,
      balance:  totalBalance,
    });

    totalsRow.height = 18;
    totalsRow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: `FF${TOTAL_ROW_COLOR}` },
      };
      cell.font = { name: "Arial", size: 8, bold: true };
      cell.border = {
        top:    { style: "thin", color: { argb: "FFD1D5DB" } },
        bottom: { style: "thin", color: { argb: "FFD1D5DB" } },
        left:   { style: "thin", color: { argb: "FFD1D5DB" } },
        right:  { style: "thin", color: { argb: "FFD1D5DB" } },
      };
    });

    // Currency format + right-align totals
    (["debit", "credit"] as const).forEach((key) => {
      const cell = totalsRow.getCell(key);
      cell.numFmt = currencyFmt;
      cell.alignment = { horizontal: "right" };
    });

    // Balance cell: red if negative, green if positive
    const balanceCell = totalsRow.getCell("balance");
    balanceCell.numFmt = currencyFmt;
    balanceCell.alignment = { horizontal: "right" };
    balanceCell.font = {
      name: "Arial",
      size: 8,
      bold: true,
      color: { argb: totalBalance < 0 ? `FF${NEGATIVE_COLOR}` : `FF${POSITIVE_COLOR}` },
    };

    // ── Download ──────────────────────────────────────────────────
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${selectedVendorName ?? "Vendor"} Vendor Ledger.xlsx`);
  };

  return { handleExport };
};