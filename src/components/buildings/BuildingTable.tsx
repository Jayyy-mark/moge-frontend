'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Building } from "../../interfaces/building";
import { buildingColumns } from "../columns/BuildingColumn";
import { buildingApi } from "../../api/buildingApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function BuildingTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Building | null>(null);

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const data = await buildingApi.all();
        console.log("this is building data", data.buildings);
        setBuildings(data.buildings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchBuildings();
  }, []);

  const handleDeleteClick = (building: Building) => {
  setDeleteTarget(building);
  setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await buildingApi.delete(deleteTarget.id);

      toast.success(data.message);

      setBuildings((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleEditBuilding = async (building: Building) => {
    navigate(`/buildings/edit/${building.id}`);
  }

  return (
    <>
      <DataTable
        data={buildings}
        columns={buildingColumns(handleEditBuilding, handleDeleteClick)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete Building"
        message={`Are you sure you want to delete "${deleteTarget?.building_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
