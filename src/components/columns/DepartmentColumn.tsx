import { ColumnDef } from "@tanstack/react-table";
import { Department } from "../../interfaces/department";
import Button from "../ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";

export const departmentColumns = (
  onEdit: (Department: Department) => void,
  onDelete: (Department: Department) => void
): ColumnDef<Department>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        </div>
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
    },
    {
      accessorKey: "department_id",
      header: "ID",
    },
    {
      accessorKey: "department_name",
      header: "Name",
    },
    {
      accessorFn: (row) => row.room?.room_no ?? "No Room has been asigned",
      header: "Room No",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const Department = row.original;

        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onEdit(Department)}
              className="flex items-center gap-1 px-1 py-0.5 text-[13px]" // smaller padding & text
            >
              <Pencil size={12} /> {/* smaller icon */}
              <span className="hidden sm:inline">Edit</span>
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => onDelete(Department)}
              className="flex items-center gap-1 px-1 py-0.5 text-[13px]" // smaller padding & text
            >
              <Trash2 size={12} /> {/* smaller icon */}
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>

        );
      },
    },
  ];
