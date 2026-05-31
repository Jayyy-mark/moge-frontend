'use client';


import { DataTable } from "../tables/data-table";

import { useNavigate } from "react-router";
import { Stype } from "../../interfaces/stype";
import { stypeColumns } from "../columns/StypeColumn";
import { stypeApi } from "../../api/stypeApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DtypeTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [stypes, setstypes] = useState<Stype[]>([]);

  //uncommand for modal box
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedstype, setSelectedstype] = useState<stype | null>(null);

  useEffect(() => {
    const fetchStypes = async () => {
      try {
        const data = await stypeApi.all();
        setstypes(data.stypes);
      } catch (error) {
        toast.error("Error occured!");
      }
    }

    fetchStypes();
  }, []);


  const handleDeleteStype = async (stype: Stype) => {
    if (!confirm(`Delete stype ${stype.stype_name}?`)) return;
    console.log(stype.id);
    const data = await stypeApi.delete(stype.id);
    toast.success(data.message);
    setstypes((prev) => prev.filter((r) => r.id !== stype.id));
  };

  const handleEditStype = async (stype: Stype) => {
    navigate(`/stypes/edit/${stype.id}`);
  }

  // const editstype = (stype: stype) => {
  //   setSelectedstype(stype);
  //   setIsOpen(true);
  // }

  // const handleUpdate = () => {
  //   alert("success!");
  // }

  return (
    <>
      <DataTable
        data={stypes}
        columns={stypeColumns(handleEditStype, handleDeleteStype)}
      />

      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="bg-white rounded-2xl shadow-lg w-[350px] p-6">

            <h2 className="text-xl font-semibold mb-4">Edit stype</h2>

            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedstype?.stype_name || ""}
              onChange={(e) =>
                setSelectedstype({
                  ...selectedstype!,
                  stype_name: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )} */}
    </>
  );
}
