'use client';


import { DataTable } from "../tables/data-table";

import { useNavigate } from "react-router";
import { Rank } from "../../interfaces/ranks";
import { rankColumns } from "../columns/RankColumns";
import { rankApi } from "../../api/rankApi";
import { useEffect, useState } from "react";

export default function RankTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [ranks, setranks] = useState<Rank[]>([]);

  //uncommand for modal box
  // const [isOpen, setIsOpen] = useState(false);
  // const [selectedrank, setSelectedrank] = useState<Rank | null>(null);

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const data = await rankApi.all();
        console.log("this is rank data", data.ranks);
        setranks(data.ranks);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRanks();
  }, []);


  const handleDeletRrank = async (rank: Rank) => {
    if (!confirm(`Delete rank ${rank.rank_name}?`)) return;
    console.log(rank.id);
    const data = await rankApi.delete(rank.id);
    alert(data.message);
    setranks((prev) => prev.filter((r) => r.id !== rank.id));
  };

  const handleEditRank = async (rank: Rank) => {
    navigate(`/ranks/edit/${rank.id}`);
  }

  // const editRank = (rank: Rank) => {
  //   setSelectedrank(rank);
  //   setIsOpen(true);
  // }

  // const handleUpdate = () => {
  //   alert("success!");
  // }

  return (
    <>
      <DataTable
        data={ranks}
        columns={rankColumns(handleEditRank, handleDeletRrank)}
      />

      {/* {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="bg-white rounded-2xl shadow-lg w-[350px] p-6">

            <h2 className="text-xl font-semibold mb-4">Edit rank</h2>

            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedrank?.rank_name || ""}
              onChange={(e) =>
                setSelectedrank({
                  ...selectedrank!,
                  rank_name: e.target.value,
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
