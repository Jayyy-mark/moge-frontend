'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Role } from "../../interfaces/role";
import { roleColumns } from "../columns/RoleColumn";
import { roleApi } from "../../api/roleApi";
import { useEffect, useState } from "react";

export default function RoleTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await roleApi.all();
        console.log("this is role data", data.roles);
        setRoles(data.roles);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoles();
  }, []);


  const handleDeleteRole = async (role: Role) => {
    if (!confirm(`Delete role ${role.role_name}?`)) return;
    const data = await roleApi.delete(role.id);
    alert(data.message);
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
  };

  const handleEditRole = async (role: Role) => {
    navigate(`/roles/edit/${role.id}`);
  }


  const handleUpdate = () => {
    alert("success!");
  }

  return (
    <>
      <DataTable
        data={roles}
        columns={roleColumns(handleEditRole, handleDeleteRole)}
      />

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[9999]">
          <div className="bg-white rounded-2xl shadow-lg w-[350px] p-6">

            <h2 className="text-xl font-semibold mb-4">Edit Role</h2>

            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRole?.role_name || ""}
              onChange={(e) =>
                setSelectedRole({
                  ...selectedRole!,
                  role_name: e.target.value,
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
      )}
    </>
  );
}
