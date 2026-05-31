import { ColumnDef } from "@tanstack/react-table";
import { Log } from "../../interfaces/log";
import { helper } from "../../helpers/utils";
import Button from "../ui/button/Button";
import { Trash2 } from "lucide-react";

export const LogColumns = (
    onDelete:(log:Log)=>void,
):ColumnDef<Log>[]=>[
    {
        id:"select",
        header:({table})=>(
            <div className="flex items-center">
                <input 
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            </div>
        ),
        cell:({row})=>(
            <div className="flex items-center">
                <input 
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()} 
                />
            </div>
        ),
        size:40,
    },
    {
        header:"User",
        cell:({ row }) => row.original.user?.username,
    },
    {
        header:"Resource table",
        cell:({ row }) => row.original.model_name,
    },
    {
        header:"Action",
        cell:({ row }) => row.original.action.toUpperCase(),
    },
    {
        header:"Description",
        cell:({row})=> (
            <div>
                <span className="text-blue-500 hover:underline">
                    {row.original.description}
                </span>
            </div>
        ),    
    },
    {
        header:"Performed Time",
        cell:({ row }) => helper.formatStrDate(row.original.created_at),
    },
    {
        id:"actions",
        header:"Actions",
        cell:({row})=>{
            const Log = row.original;
            return (
                <div className="flex gap-1">
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={()=>onDelete(Log)}
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