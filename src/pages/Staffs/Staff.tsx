import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import StaffTable from "../../components/staffs/StaffTable";
import SearchStaff from "../../components/staffs/SearchStaff";
import Button from "../../components/ui/button/Button";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Staff, StaffSearch } from "../../interfaces/staff";
import { staffApi } from "../../api/staffApi";
import { toast } from "react-toastify";

export default function Staffs() {
  const searchRef = useRef<any>(null);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchAllStaffs = async () => {
    try {
      const data = await staffApi.all();
      setStaffs(data.staffs);
      
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch staff lists");
    }
  };

  useEffect(() => {
    fetchAllStaffs();
  }, []);

  const handleSearch = async (data: StaffSearch) => {
    try {
      const staffs = await staffApi.search(data);
      setStaffs(staffs);
      setIsSearching(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to fetch staff lists");
    }
  };

  const handleClearSearch = async () => {
    // reset search form (via ref)
    searchRef.current?.reset?.();

    // refetch all data
    await fetchAllStaffs();
    setIsSearching(false);
    toast.info("Search cleared");
  }

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb pageTitle="Staff Management" />
      <div className="space-y-6">
        <ComponentCard
          title="Search Documents"
          footerChildren={
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => searchRef.current?.submit()}
                className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
              >
                <Search size={15} />
                <span className="hidden sm:inline">Search</span>
              </Button>
              {isSearching && (
                <Button
                  size="sm"
                  variant="info"
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 px-1 py-0.5 text-[13px]"
                >
                  Clear
                </Button>
              )}
            </div>
          }>
          <SearchStaff ref={searchRef} onSearch={handleSearch} />
        </ComponentCard>
        <ComponentCard title="Staff Table">
          <StaffTable staffs={staffs} setStaffs={setStaffs} />
        </ComponentCard>
      </div>
    </>
  );
}
