import { IconFileTypePdf } from '@tabler/icons-react';
import { usePDFExporter } from '@/handler/PDFExporterHandler';

export const PDFExporter = () => {
    const { handleExport } = usePDFExporter();
    return (
        <div 
        onClick={handleExport}
        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors w-fit">
            <IconFileTypePdf stroke={1} />
            <p className="text-sm">Export to PDF</p>
        </div>
    )
}