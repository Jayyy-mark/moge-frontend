import { useState } from "react";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../../form/Label.tsx";
import Input from "../../form/input/InputField.tsx";
import Select from "react-select";
import { EyeCloseIcon, EyeIcon } from "../../../icons/index.ts";
import { userApi } from "../../../api/userApi.ts";
import { AddUserForm } from "../../../interfaces/user.ts";
import { useNavigate } from "react-router";
import { useSelectOptions } from "../../../hooks/useSelectOptions.ts";
import { helper } from "../../../helpers/utils.ts";
import { toast } from "react-toastify";


export default function AddUserFormComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<AddUserForm>({
    username: "",
    email: "",
    role: "",
    password1: "",
    password2: "",
    staff_id: "",
  });

  const roleOptions = [
    { value: "super admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "moderator", label: "Moderator" },
    { value: "user", label: "User" },
  ];

  const handleSubmit = async () => {
    console.log("this is form data : ", form);
    if (!form.username || !form.email || !form.role || !form.password1 || !form.password2) {
      alert("Please fill all fields");
      return;
    }

    if (form.password1 !== form.password2) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await userApi.create(form);
      console.log("this is response from user create : ", res)
      toast.success("User created successfully!");
      setForm({ username: "", email: "", role: "", password1: "", password2: "", staff_id:"" });
      navigate("/users/");
      // Optional: reset form
    } catch (err: any) {
      alert(err.response.data || " ERR occured");
      console.log("Error : ", err);
      toast.error(err.response.data.username || " ERR occured");
    }
  };

  const { options: staffOptions } = useSelectOptions(
    helper.fetchStaffs,
    "staff_name"
  );





  return (
    <ComponentCard title="Add User">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Enter username"
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="text"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter email"
          />
        </div>

        <div>
          <Label>Role : </Label>
          <Select
            options={roleOptions}
            value={roleOptions.find(o => o.value === form.staff_id)}
            onChange={(option : any)=>{
              setForm(prev=>({
                ...prev,
                role:option?.value
              }));
            }}
            isSearchable
            isClearable
          />
        </div>

        <div>
          <Label>Staff : </Label>
          <Select
            options={staffOptions}
            value={staffOptions.find(o => o.value === form.staff_id)}
            onChange={(option: any) => {
              setForm(prev => ({
                ...prev,
                staff_id: option?.value || "",
                email: option?.data?.staff_email || ""
              }));
            }}
            isSearchable
            isClearable
          />
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password1}
              onChange={(e) => setForm({ ...form, password1: e.target.value })}
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <Label>Re-type Password</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={form.password2}
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
              placeholder="Re-enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
            >
              {showPassword ? (
                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              ) : (
                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            onClick={handleSubmit}
            className="
      flex items-center gap-2 
      px-4 py-2 
      bg-gradient-to-r from-blue-500 to-blue-600 
      text-white text-sm font-medium 
      rounded-md 
      shadow-sm 
      hover:from-blue-600 hover:to-blue-700 
      transition-all duration-200 
      transform hover:-translate-y-0.5 active:scale-95 
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1
    "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create User
          </button>
        </div>

      </div>
    </ComponentCard>
  );
}
