import { useEffect, useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../../form/Label.tsx";
import Input from "../../form/input/InputField.tsx";
import { useParams } from "react-router";
import { userApi } from "../../../api/userApi.ts";
import Select from "../../form/Select.tsx";

const emptyUser: User = {
  id: 0,
  user_id: "",
  username: "",
  email: "",
  role: "",
};

export default function EditUserInputs() {
  const options = [
    { value: "admin", label: "admin" },
    { value: "staff", label: "staff" },
    { value: "user", label: "user" },
  ];

  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [user, setUser] = useState<User>(emptyUser);
  const [loading, setLoading] = useState(isEditMode);

  const handleSelectChange = (value: string) => {
    setUser({ ...user, role: value });
  };

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const data = await userApi.getById(id);
      setUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async () => {
    try {
      // Call your update API here
      // Example: await userApi.update(user.id, { username: user.username, email: user.email, role: user.role });
      alert("Update API not implemented yet");
    } catch (err: any) {
      alert(err?.message || "Something went wrong!");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <ComponentCard title={isEditMode ? "Edit User" : "Create User"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <Label>ID</Label>
          <Input type="text" value={user.user_id} disabled />
        </div>

        <div>
          <Label>Username</Label>
          <Input
            type="text"
            value={user.username}
            onChange={(e) =>
              setUser({ ...user, username: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="text"
            value={user.email}
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Role</Label>
          <Select
            options={options}
            placeholder="Select role"
            value={user.role}
            onChange={handleSelectChange}
            className="dark:bg-dark-900"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
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
            Update User
          </button>
        </div>

      </div>
    </ComponentCard>
  );
}
