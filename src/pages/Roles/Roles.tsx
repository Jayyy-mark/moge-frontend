import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import RoleTable from "../../components/roles/RoleTable";

export default function Roles() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Staff Role Management" />
      <div className="space-y-6">
        <ComponentCard title="Role Table">
          <RoleTable/>
        </ComponentCard>
      </div>
    </>
  );
}
