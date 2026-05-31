'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Staff } from "../../interfaces/staff";
import { staffColumns } from "../columns/StaffColumn";
import { staffApi } from "../../api/staffApi";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function StaffTable({
  staffs,
  setStaffs
}: {
  staffs: Staff[];
  setStaffs: React.Dispatch<React.SetStateAction<Staff[]>>;
}) {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);

  const handleDeleteClick = (staff: Staff) => {
    setDeleteTarget(staff);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await staffApi.delete(deleteTarget.id);
      toast.success(data.message);
      setStaffs((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleEditstaff = async (staff: Staff) => {
    navigate(`/staffs/edit/${staff.id}`);
  }

  console.log("this is staff data : ", staffs);
  return (
    <>
      <DataTable
        data={staffs}
        columns={staffColumns(handleEditstaff, handleDeleteClick)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete staff"
        message={`Are you sure you want to delete "${deleteTarget?.staff_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
