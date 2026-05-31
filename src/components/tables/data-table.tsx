'use client';

import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import { Search, Trash2, FileText, FileSpreadsheet, File } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, Table, TableRow, TableCell } from "docx";
import { ColumnDef } from "@tanstack/react-table";


type DataTableProps<T extends { id: number }> = {
  data: T[];
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
};

export function DataTable<T extends { id: number }>({
  data,
  columns,
  isLoading = false,
}: DataTableProps<T>) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, rowSelection },

        onGlobalFilterChange: setGlobalFilter,

        globalFilterFn: (row, value) => {
            const search = String(value)
                .toLowerCase()
                .normalize("NFKC");

            const flatten = (obj : unknown):string => {
                if (obj == null) return "";

                if (typeof obj === "string" || typeof obj === "number") {
                    return String(obj);
                }

                if (obj instanceof Date) {
                    return obj.toISOString();
                }

                if (Array.isArray(obj)) {
                    return obj.map(flatten).join(" ");
                }

                if (typeof obj === "object") {
                    return Object.values(obj).map(flatten).join(" ");
                }

                return "";
            };

            const dataString = flatten(row.original)
                .toLowerCase()
                .normalize("NFKC");

            return dataString.includes(search);
        },
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });
    const exportData = table
        .getFilteredRowModel()
        .rows.map((row) => row.original);

    const exportPDF = () => {
        const doc = new jsPDF();

        autoTable(doc, {
            head: [Object.keys(exportData[0] || {})],
            body: exportData.map(Object.values),
        });

        doc.save("documents.pdf");
    };
    const exportExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

        XLSX.writeFile(workbook, "documents.xlsx");
    };
    const exportWord = async () => {
        const tableRows = exportData.map(
            (row) =>
                new TableRow({
                    children: Object.values(row).map(
                        (cell) =>
                            new TableCell({
                                children: [new Paragraph(String(cell ?? ""))],
                            })
                    ),
                })
        );

        const doc = new Document({
            sections: [
                {
                    children: [
                        new Table({
                            rows: tableRows,
                        }),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "documents.docx");
    };




    return (
        <div className="space-y-4">
            <div className="rounded-xl border bg-white overflow-hidden border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="flex items-center justify-between px-5 py-4 overflow-x-auto overflow-y-auto min-w-0">
                    {/* LEFT: Show entries */}
                    <div className="flex items-center gap-2 text-base">
                        <span>Show</span>
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                            className="rounded border px-2 py-1 text-base"
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                        <span>entries</span>
                    </div>

                    {/* RIGHT: Search + Actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Search */}
                        <div className="relative w-64 flex-shrink-0">
                            <input
                                value={globalFilter ?? ""}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                placeholder="Search..."
                                className="w-full rounded border px-3 py-2 pr-9 text-base focus:outline-none focus:ring-1"
                            />
                            <Search
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                        </div>

                        {/* Delete All */}
                        <button
                            disabled={table.getSelectedRowModel().rows.length === 0}
                            onClick={() => {
                                const ids = table
                                    .getSelectedRowModel()
                                    .rows.map((row) => row.original.id);

                                console.log("Bulk delete IDs:", ids);
                            }}
                            className="flex items-center gap-2 rounded bg-red-600 px-3 py-2 text-base text-white disabled:opacity-50"
                        >
                            <Trash2 size={16} />
                            Delete All
                        </button>

                        {/* Export buttons */}
                        <div className="flex gap-2">
                            <button
                                onClick={exportPDF}
                                className="rounded border px-3 py-2 text-base flex items-center gap-1">
                                <FileText size={16} />
                                PDF
                            </button>

                            <button
                                onClick={exportExcel}
                                className="rounded border px-3 py-2 text-base flex items-center gap-1">
                                <FileSpreadsheet size={16} />
                                Excel
                            </button>

                            <button
                                onClick={exportWord}
                                className="rounded border px-3 py-2 text-base flex items-center gap-1">
                                <File size={16} />
                                Word
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="relative overflow-visible">
                    <div className="max-h-[500px] overflow-x-auto overflow-y-visible custom-scrollbar">
                        <table className="min-w-full table-fixed divide-y">
                            <thead className="sticky text-left top-0 bg-gray-50 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="px-5 py-4 left text-base max-w-[280px] break-words item-left" // removed truncate & nowrap
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === "asc" && " ↑"}
                                                {header.column.getIsSorted() === "desc" && " ↓"}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>

                            <tbody className="divide-y bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={table.getAllColumns().length} className="text-center py-4">
                                            Loading data...
                                        </td>
                                    </tr>
                                ) : table.getRowModel().rows.length > 0 ? (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td
                                                    key={cell.id}
                                                    title={String(cell.getValue() ?? "")}
                                                    className="px-5 py-4 text-sm break-words"
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={table.getAllColumns().length} className="text-center py-4">
                                            No Data Available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Pagination */}
                <div className="flex items-center justify-between px-5 py-4 border-t text-base">
                    {/* LEFT: Info */}
                    <span className="text-gray-500">
                        Showing{" "}
                        {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                        {" "}to{" "}
                        {Math.min(
                            (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                            table.getFilteredRowModel().rows.length
                        )}
                        {" "}of{" "}
                        {table.getFilteredRowModel().rows.length} entries
                    </span>

                    {/* RIGHT: Pagination */}
                    <div className="flex items-center gap-2">
                        {/* Previous */}
                        <button
                            className="rounded-md border px-3 py-1 disabled:opacity-50"
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                        >
                            Previous
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: table.getPageCount() }).map((_, index) => {
                            const isActive = index === table.getState().pagination.pageIndex;

                            return (
                                <button
                                    key={index}
                                    onClick={() => table.setPageIndex(index)}
                                    className={`px-3 py-1 rounded-md text-base
            ${isActive
                                            ? "bg-blue-50 text-blue-600 font-medium"
                                            : "hover:bg-gray-100"}
          `}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            className="rounded-md border px-3 py-1 disabled:opacity-50"
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                        >
                            Next
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
