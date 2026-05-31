import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { useNavigate, useParams } from "react-router";
import { Stype } from "../../interfaces/stype";
import { stypeApi } from "../../api/stypeApi.ts";
import { toast } from "react-toastify";

const emptyStype: Stype = {
  id: 0,
  stype_id:"",
  stype_name:"",
};

export default function EditStypeForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [stype, setstype] = useState<Stype>(emptyStype);
  const [loading, setLoading] = useState(isEditMode);


  useEffect(() => {
    if (!id) return;

    const fetchstype = async () => {
      const data = await stypeApi.getById(id)
      setstype(data.stype);
      setLoading(false);
    };

    fetchstype();
  }, [id]);

  const handleSubmit = async () => {
    try {
        const data = await stypeApi.update(stype)
        console.log("this is update data", data?.stype);
        toast.success("Updated successfully!");
        navigate("/stypes/");
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <ComponentCard title={"Edit stype"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
            <Label>ID</Label>
            <Input type="text" value={stype.id} disabled/>
        </div>

        <div>
          <Label>stype ID</Label>
          <Input type="text" value={stype.stype_id} />
        </div>

        <div>
          <Label>stype Name</Label>
          <Input
            type="text"
            value={stype.stype_name}
            onChange={(e) =>
              setstype({ ...stype, stype_name: e.target.value })
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
