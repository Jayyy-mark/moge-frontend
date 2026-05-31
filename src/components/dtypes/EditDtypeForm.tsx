import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { useNavigate, useParams } from "react-router";
import { Dtype } from "../../interfaces/dtype";
import { dtypeApi } from "../../api/dtypeApi.ts";
import { toast } from "react-toastify";

const emptyDtype: Dtype = {
  id: 0,
  dtype_id:"",
  dtype_name:"",
};

export default function EditDtypeForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [dtype, setdtype] = useState<Dtype>(emptyDtype);
  const [loading, setLoading] = useState(isEditMode);


  useEffect(() => {
    if (!id) return;

    const fetchdtype = async () => {
      const data = await dtypeApi.getById(id)
      setdtype(data.dtype);
      setLoading(false);
    };

    fetchdtype();
  }, [id]);

  const handleSubmit = async () => {
    try {
        const data = await dtypeApi.update(dtype)
        console.log("this is update data", data?.dtype);
        toast.success("Updated successfully!");
        navigate("/dtypes/");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <ComponentCard title={"Edit dtype"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
            <Label>ID</Label>
            <Input type="text" value={dtype.id} disabled/>
        </div>
        <div>
          <Label>Document type ID</Label>
          <Input type="text" value={dtype.dtype_id} />
        </div>
        <div>
          <Label>Document type Name</Label>
          <Input
            type="text"
            value={dtype.dtype_name}
            onChange={(e) =>
              setdtype({ ...dtype, dtype_name: e.target.value })
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
