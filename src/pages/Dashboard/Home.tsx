import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import MonthlyDocumentsChart from "../../components/ecommerce/MonthlyDocumentsChart";
import { DocumentCategoryChart } from "../../components/ecommerce/DocumentCategoryChart";
import SystemUsers from "../../components/ecommerce/SystemUsers";
import StorageUsageCard from "../../components/ecommerce/StroageUsageCard";
import StaffTable from "../../components/tables/BasicTables/BasicTableOne";

export default function Home() {
  return (
    <>
      <PageMeta
        title="TailAdmin - Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <DocumentCategoryChart/>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <StorageUsageCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <StaffTable />
        </div>

        <div className="col-span-12">
          <MonthlyDocumentsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-12">
          <SystemUsers />
        </div>
      </div>
    </>
  );
}
