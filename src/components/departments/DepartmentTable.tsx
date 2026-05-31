'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Department } from "../../interfaces/department";
import { departmentColumns } from "../columns/DepartmentColumn";
import { departmentApi } from "../../api/departmentApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function DepartmentTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Department | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await departmentApi.all();
        setDepartments(data.departments);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDepartments();
  }, []);

  const handleDeleteClick = (department: Department) => {
  setDeleteTarget(department);
  setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await departmentApi.delete(deleteTarget.id);
      toast.success(data.message);
      setDepartments((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleEditdepartment = async (department: Department) => {
    navigate(`/departments/edit/${department.id}`);
  }

  return (
    <>
      <DataTable
        data={departments}
        columns={departmentColumns(handleEditdepartment, handleDeleteClick)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete department"
        message={`Are you sure you want to delete "${deleteTarget?.department_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
