import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DtypeTable from "../../components/dtypes/DtypeTable";

export default function Dtypes() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Document types management" />
      <div className="space-y-6">
        <ComponentCard title="Document types table">
          <DtypeTable/>
        </ComponentCard>
      </div>
    </>
  );
}
