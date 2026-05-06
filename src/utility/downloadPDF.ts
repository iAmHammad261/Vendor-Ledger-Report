export const downloadPDF = (pdfBlob: Blob, fileName: string) => {
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
};
