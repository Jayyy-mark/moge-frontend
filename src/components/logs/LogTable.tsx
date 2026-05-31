
import { Log } from "../../interfaces/log";
import { DataTable } from "../tables/data-table";
import { LogColumns } from "../columns/LogColumn";
import { useEffect, useState } from "react";
import { auditLogApi } from "../../api/auditLogApi";
import { toast } from "react-toastify";

export default function LogTable() {

    const [logs, setLogs] = useState<Log[]>([]);

    useEffect(()=>{
        const fetchLogs = async () =>{
            try {
                const data = await auditLogApi.all();
                setLogs(data);
            } catch (error:any) {
                console.log("Error ", error);
                toast.error(error?.message || "Error Occured!");
            }
        };

        fetchLogs();
    }, []);

    const handleDeleteLog = async(log:Log) =>{
        if(!confirm(`Delete Log ${log.id}?`)) return;
    }

    return (
        <DataTable
            data={logs}
            columns={LogColumns(handleDeleteLog)}
        />
    );
}