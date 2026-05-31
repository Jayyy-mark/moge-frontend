import { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { AddRole } from "../../interfaces/role";
import { roleApi } from "../../api/roleApi";
import { useNavigate } from "react-router";

export default function AddRoleForm() {

    const navigate = useNavigate();
    const [form, setFrom] = useState<AddRole>({
        role_name: "",
    });

    const handleSubmit = async() =>{
        if(form.role_name == null){
            alert("Please enter role name!");
            return;
        }

        try {
            const data = roleApi.create(form)
            console.log(data);
            alert(data?.message || "Created successfully!");
            navigate('/roles/');
        } catch (error : any) {
            console.log(error);
            alert(error?.message || "Falied to create role!"); 
        }
    };

    return (
        <ComponentCard title="Add Role">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label>Role Name:</Label>
                    <Input
                        type="text"
                        placeholder="Enter Role name"
                        value={form.role_name}
                        onChange={(e) => setFrom({ ...form, role_name: e.target.value })}
                    ></Input>
                </div>

                <div className="md:col-span-3 flex">
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
                        Create Role
                    </button>
                </div>
            </div>
        </ComponentCard>
    );
}