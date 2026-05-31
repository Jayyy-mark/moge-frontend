'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Category } from "../../interfaces/category";
import { categoryColumns } from "../columns/CategoryColumn";
import { categoryApi } from "../../api/categoryApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function CategoryTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.all();
        console.log("this is category data : ", data.categories);
        setCategories(data.categories);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, []);

  const handleDeleteClick = (category: Category) => {
  setDeleteTarget(category);
  setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await categoryApi.delete(deleteTarget.id);
      toast.success(data.message);
      setCategories((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleEditcategory = async (category: Category) => {
    navigate(`/categories/edit/${category.id}`);
  }

  return (
    <>
      <DataTable
        data={categories}
        columns={categoryColumns(handleEditcategory, handleDeleteClick)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete category"
        message={`Are you sure you want to delete "${deleteTarget?.category_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
