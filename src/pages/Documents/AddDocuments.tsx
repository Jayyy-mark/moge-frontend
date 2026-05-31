import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AddDocumentForm from "../../components/documents/AddDocumentForm";

export default function AddDocuments() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Documents Management" />
      <div className="space-y-6">
        <ComponentCard
            title="Upload Documents"
        >
          <AddDocumentForm/>
        </ComponentCard>
      </div>
    </>
  );
}
