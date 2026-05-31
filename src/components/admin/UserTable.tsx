'use client';

import { useUsers } from "../../hooks/useUsers";
import { DataTable } from "../tables/data-table";
import { userColumns } from "../columns/UserColumns";
import { userApi } from "../../api/userApi";
import { User } from "../../interfaces/user";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function UserTable() {
  const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Delete user ${user.username}?`)) return;
    const message = await userApi.delete(user.id);
    mutate();
    alert(message);
  };

  const handleEditUser = async (user: User) => {
    navigate(`/users/edit/${user.id}`);
  }

  if (error){
    toast.error(error);
  }

  return (
    <DataTable
      data={data?.users ?? []}
      columns={userColumns(handleEditUser, handleDeleteUser)}
      isLoading={isLoading}
    />
  );
}
