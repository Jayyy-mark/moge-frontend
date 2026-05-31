import { useEffect, useState } from "react";
import ComponentCard from "../common/ComponentCard.tsx";
import Label from "../form/Label.tsx";
import Input from "../form/input/InputField.tsx";
import { useNavigate, useParams } from "react-router";
import { Building } from "../../interfaces/building.ts";
import { buildingApi } from "../../api/buildingApi.ts";
import { toast } from "react-toastify";


const emptyBuilding: Building = {
  id: 0,
  building_id:"",
  building_name:"",
};

export default function EditBuildingForm() {

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [building, setBuilding] = useState<Building>(emptyBuilding);
  const [loading, setLoading] = useState(isEditMode);


  useEffect(() => {
    if (!id) return;

    const fetchBuilding = async () => {
      const data = await buildingApi.getById(id)
      setBuilding(data.building);
      setLoading(false);
    };

    fetchBuilding();
  }, [id]);

  const handleSubmit = async () => {
    try {
        const data = await buildingApi.update(building)
        toast.success(data.message);
        navigate("/buildings/");
    } catch (err: any) {
      alert(err?.message || "Something went wrong!");
    }
  };

  if (loading) return <p>Loading user...</p>;

  return (
    <ComponentCard title={isEditMode ? "Edit building" : "Create building"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
            <Label>ID</Label>
            <Input type="text" value={building.id} disabled/>
        </div>

        <div>
          <Label>building ID</Label>
          <Input type="text" value={building.building_id} />
        </div>

        <div>
          <Label>building Name</Label>
          <Input
            type="text"
            value={building.building_name}
            onChange={(e) =>
              setBuilding({ ...building, building_name: e.target.value })
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
