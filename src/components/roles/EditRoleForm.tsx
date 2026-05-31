import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { useNavigate, useParams } from "react-router";
import { Role } from "../../interfaces/role.ts";
import { roleApi } from "../../api/roleApi.ts";

const emptyRole: Role = {
  id: 0,
  role_id:"",
  role_name:"",
};

export default function EditRoleForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [role, setRole] = useState<Role>(emptyRole);
  const [loading, setLoading] = useState(isEditMode);


  useEffect(() => {
    if (!id) return;

    const fetchRole = async () => {
      const data = await roleApi.getById(id)
      setRole(data.role);
      setLoading(false);
    };

    fetchRole();
  }, [id]);

  const handleSubmit = async () => {
    try {
        const data = await roleApi.update(role)
        console.log("this is update data", data?.role);
        alert("Updated successfully!");
        navigate("/roles/");
    } catch (err: any) {
      alert(err?.message || "Something went wrong!");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <ComponentCard title={isEditMode ? "Edit Role" : "Create Role"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
            <Label>ID</Label>
            <Input type="text" value={role.id} disabled/>
        </div>

        <div>
          <Label>Role ID</Label>
          <Input type="text" value={role.role_id} />
        </div>

        <div>
          <Label>Role Name</Label>
          <Input
            type="text"
            value={role.role_name}
            onChange={(e) =>
              setRole({ ...role, role_name: e.target.value })
            }
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex">
          <button
            onClick={handleSubmit}
            className="
              flex items-center gap-2
              px-4 py-2
              bg-gradient-to-r from-green-500 to-green-600
              text-white text-sm font-medium
              rounded-md
              shadow-sm
              hover:from-green-600 hover:to-green-700
              transition-all duration-200
              transform hover:-translate-y-0.5 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1
            "
          >
            update
          </button>
        </div>

      </div>
    </ComponentCard>
  );
}
