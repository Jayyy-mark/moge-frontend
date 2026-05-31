import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../interfaces/user";
import Button from "../ui/button/Button";
import { Pencil, Trash2 } from "lucide-react";

export const userColumns = (
  onEdit:(user:User)=>void,
  onDelete:(user:User)=>void
): ColumnDef<User>[] => [
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
    accessorKey: "user_id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => onEdit(user)}
            className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
          >
            <Pencil size={14} />
            <span className="hidden sm:inline">Edit</span>
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={()=>onDelete(user)}
            className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      );
    },
  },
];
