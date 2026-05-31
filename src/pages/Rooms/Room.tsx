import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RoomTable from "../../components/rooms/RoomTable";

export default function Rooms() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Staff Room Management" />
      <div className="space-y-6">
        <ComponentCard title="Room Table">
          <RoomTable/>
        </ComponentCard>
      </div>
    </>
  );
}
