import { IconFileTypeXls } from '@tabler/icons-react';
import { useExcelExporter } from '@/handler/ExcelExporterHandler';

export const ExcelExporter = () => {
    const {handleExport} = useExcelExporter();
    return (
        <div 
                onClick={handleExport}
        className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-1 cursor-pointer hover:bg-gray-100 transition-colors w-fit">
            <IconFileTypeXls stroke={1} />
            <p className="text-sm">Export to Excel</p>
        </div>
    )
}