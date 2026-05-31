import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "../../interfaces/staff";
import Button from "../ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";

export const staffColumns = (
    onEdit: (staff: Staff) => void,
    onDelete: (staff: Staff) => void
): ColumnDef<Staff>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 40, // Fixed small size
            enableResizing: false, // Disable resizing for checkbox
        },
        {
            accessorKey: "staff_id",
            header: "ID",
            size: 80, // Small fixed width
        },
        {
            accessorKey: "staff_name",
            header: "Name",
            size: 150, // Default width
        },
        {
            id: "contact",
            header: "Contact",
            accessorFn: (row) => row, // Pass the whole row to the cell
            cell: ({ row }) => {
                const { staff_email, staff_ph_number: staff_phone, staff_address } = row.original;
                return (
                    <div className="flex flex-col truncate max-w-[250px]">
                        <span className="truncate font-medium" title={staff_email}>
                            {staff_email}
                        </span>
                        <span className="truncate text-gray-500 text-sm" title={staff_phone}>
                            {staff_phone}
                        </span>
                        <span className="truncate text-gray-500 text-sm" title={staff_address}>
                            {staff_address}
                        </span>
                    </div>
                );
            },
            minSize: 200,
            maxSize: 300,
        },
        {
            accessorKey: "staff_gender",
            header: "Gender",
            size: 80,
        },
        {
            accessorFn: (row) => row.department?.department_name ?? "Unassigned",
            header: "Department",
            size: 150,
        },
        {
            accessorFn: (row) => row.role?.role_name ?? "Unassigned",
            header: "Role",
            size: 150,
        },
        {
            header: "Rank",
            size: 150,
            cell: ({row}) => (
                row.original.rank?.rank_name
            ),
        },
        {
            id: "actions",
            header: "Action",
            enableResizing: true, // Allow resizing this one
            size: 130, // Fixed base size
            cell: ({ row }) => {
                const staff = row.original;

                return (
                    <div className="flex gap-2 whitespace-nowrap">
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => onEdit(staff)}
                            className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
                        >
                            <Pencil size={12} />
                            <span className="hidden sm:inline">Edit</span>
                        </Button>

                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onDelete(staff)}
                            className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
                        >
                            <Trash2 size={12} />
                            <span className="hidden sm:inline">Delete</span>
                        </Button>
                    </div>
                );
            },
        },
    ];