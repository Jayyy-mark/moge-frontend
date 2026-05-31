'use client';


import { DataTable } from "../tables/data-table";

import { useNavigate } from "react-router";
import { Dtype } from "../../interfaces/dtype";
import { dtypeColumns } from "../columns/DtypeColumn";
import { dtypeApi } from "../../api/dtypeApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DtypeTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [dtypes, setdtypes] = useState<Dtype[]>([]);

  //uncommand for modal box
  // const [isOpen, setIsOpen] = useState(false);
  // const [selecteddtype, setSelecteddtype] = useState<dtype | null>(null);

  useEffect(() => {
    const fetchdtypes = async () => {
      try {
        const data = await dtypeApi.all();
        setdtypes(data.dtypes);
      } catch (error) {
        toast.error("Error occured!");
      }
    }

    fetchdtypes();
  }, []);


  const handleDeletedtype = async (dtype: Dtype) => {
    if (!confirm(`Delete dtype ${dtype.dtype_name}?`)) return;
    console.log(dtype.id);
    const data = await dtypeApi.delete(dtype.id);
    toast.success(data.message);
    setdtypes((prev) => prev.filter((r) => r.id !== dtype.id));
  };

  const handleEditdtype = async (dtype: Dtype) => {
    navigate(`/dtypes/edit/${dtype.id}`);
  }

  // const editdtype = (dtype: dtype) => {
  //   setSelecteddtype(dtype);
  //   setIsOpen(true);
  // }

  // const handleUpdate = () => {
  //   alert("success!");
  // }

  return (
    <>
      <DataTable
        data={dtypes}
        columns={dtypeColumns(handleEditdtype, handleDeletedtype)}
      />

      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="bg-white rounded-2xl shadow-lg w-[350px] p-6">

            <h2 className="text-xl font-semibold mb-4">Edit dtype</h2>

            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selecteddtype?.dtype_name || ""}
              onChange={(e) =>
                setSelecteddtype({
                  ...selecteddtype!,
                  dtype_name: e.target.value,
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
