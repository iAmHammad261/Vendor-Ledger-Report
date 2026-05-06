import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import useVendorStore from "@/store/vendorLedgerStore";
import type {
  TDocumentDefinitions,
  CustomTableLayout,
  Content,
} from "pdfmake/interfaces";
import { formatCurrency } from "../utility/formatCurrency";
import useVendorLedger from "../hooks/useVendorLedger";
import type { VendorLedgerData } from "../types/types";
import { convertDateIntoNetsuiteFormat } from "../utility/convertDateIntoNetsuiteFormat";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).vfs = pdfFonts;

const tableLayout = {
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.3,
  hLineColor: () => "#d1d5db",
  vLineColor: () => "#d1d5db",
  paddingLeft: () => 0,
  paddingRight: () => 0,
  paddingTop: () => 0,
  paddingBottom: () => 0,
} as CustomTableLayout;

const generatePDFDocument = (
  vendorName: string | null,
  vendorData: VendorLedgerData[],
  fromDate: string | null,
  toDate: string | null
): TDocumentDefinitions => {
  const totalDebit = vendorData.reduce(
    (sum, row) => sum + (Number(row.debit) || 0),
    0,
  );
  const totalCredit = vendorData.reduce(
    (sum, row) => sum + (Number(row.credit) || 0),
    0,
  );
  const totalBalance = totalDebit - totalCredit;

  const totalsRow: Content[] = [
    {
      text: "TOTAL",
      fontSize: 7,
      bold: true,
      fillColor: "#f3f4f6",
      margin: [6, 4, 6, 4],
    },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    { text: "", fontSize: 7, fillColor: "#f3f4f6", margin: [6, 4, 6, 4] },
    {
      text: formatCurrency(totalDebit),
      fontSize: 7,
      bold: true,
      fillColor: "#f3f4f6",
      margin: [6, 4, 6, 4],
      alignment: "right",
    },
    {
      text: formatCurrency(totalCredit),
      fontSize: 7,
      bold: true,
      fillColor: "#f3f4f6",
      margin: [6, 4, 6, 4],
      alignment: "right",
    },
    {
      text: formatCurrency(totalBalance),
      fontSize: 7,
      bold: true,
      fillColor: "#f3f4f6",
      margin: [6, 4, 6, 4],
      alignment: "right",
      color: totalBalance < 0 ? "#dc2626" : "#16a34a", // red if negative, green if positive
    },
  ];

  return {
    pageOrientation: "landscape",
    pageMargins: [40, 40, 40, 40],

    content: [
      // Main Heading
      {
        text: "Vendor Ledger",
        fontSize: 20,
        bold: true,
        alignment: "center",
        marginBottom: 10,
      },
      // Vendor Name
      {
        text: vendorName ?? "Al Rehan Dynamic Contractor",
        fontSize: 16,
        alignment: "center",
        marginBottom: 10,
      },
      // Date Range Subheading
       fromDate || toDate ? {
        text: `${fromDate ? fromDate : '31-Oct-2023'} to ${toDate ? toDate : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}`,
        fontSize: 14,
        alignment: "center",
        marginBottom: 10,
      } : '',
      // Table
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [7, 7, 9, 9, 11, 11, 11, 9, 9, 10].map((w) => `${w}%`),
          body: [
            // Header Row
            [
              {
                text: "Date",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Type",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Doc. #",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Trans. #",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Project",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Account",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Memo",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
              },
              {
                text: "Debit",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
                alignment: "right",
              },
              {
                text: "Credit",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
                alignment: "right",
              },
              {
                text: "Balance",
                bold: true,
                fillColor: "#4A90D9",
                color: "white",
                fontSize: 10,
                margin: [6, 6, 6, 6],
                alignment: "right",
              },
            ],
            ...vendorData
              .filter((row) => row != null && row.id != null)
              .map((row) => [
                {
                  text: row.trandate ?? "-",
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                },
                { text: row.type ?? "-", fontSize: 7, margin: [6, 4, 6, 4] },
                {
                  text: row.documentnumber ?? "-",
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                },
                {
                  text: row.transactionnumber ?? "-",
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                },
                { text: row.project ?? "-", fontSize: 7, margin: [6, 4, 6, 4] },
                { text: row.account ?? "-", fontSize: 7, margin: [6, 4, 6, 4] },
                { text: row.memo ?? "-", fontSize: 7, margin: [6, 4, 6, 4] },
                {
                  text: formatCurrency(row.debit),
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                  alignment: "right",
                },
                {
                  text: formatCurrency(row.credit),
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                  alignment: "right",
                },
                {
                  text: formatCurrency(row.balance),
                  fontSize: 7,
                  margin: [6, 4, 6, 4],
                  alignment: "right",
                },
              ]),
            totalsRow,
          ] as Content[][],
        },
        layout: tableLayout,
      },
    ],
  };
};

export const usePDFExporter = () => {
  const selectedVendorName = useVendorStore(
    (state) => state.selectedVendorName,
  );

  const selectedFromDate = useVendorStore((state) => state.fromDate);

  const selectedToDate = useVendorStore((state) => state.toDate);

  const startDate = convertDateIntoNetsuiteFormat(selectedFromDate);
  const endDate = convertDateIntoNetsuiteFormat(selectedToDate);


  const { data } = useVendorLedger();

  const handleExport = () => {
    const docDefinition = generatePDFDocument(selectedVendorName, data, startDate, endDate);
    pdfMake
      .createPdf(docDefinition)
      .download(`${selectedVendorName || "Vendor"} Vendor Ledger.pdf`);
  };

  return { handleExport };
};
