import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StypeTable from "../../components/stypes/StypeTable";

export default function Stypes() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Stypes Management" />
      <div className="space-y-6">
        <ComponentCard title="Stypes Management">
          <StypeTable/>
        </ComponentCard>
      </div>
    </>
  );
}
