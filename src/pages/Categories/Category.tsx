import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import CategoryTable from "../../components/categories/CategoryTable";

export default function Category() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Category Management" />
      <div className="space-y-6">
        <ComponentCard title="Category Management">
          <CategoryTable/>
        </ComponentCard>
      </div>
    </>
  );
}
