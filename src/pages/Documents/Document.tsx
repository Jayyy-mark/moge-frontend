import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DocumentTable from "../../components/documents/DocumentTable";
import SearchDocument from "../../components/documents/SearchDocument";
import Button from "../../components/ui/button/Button";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, DocumentSearch } from "../../interfaces/document";
import { documentApi } from "../../api/documentApi";
import { toast } from "react-toastify";

export default function Documents() {
  const searchRef = useRef<any>(null);
  const [Documents, setDocuments] = useState<Document[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const fetchAllDocuments = async () => {
    try {
      const data = await documentApi.all();
      setDocuments(data.documents);
      console.log("this is data from fetch ", Documents);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch Document lists");
    }
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

  useEffect(() => {
    const autoScrollPage = async () => {
      if (isSearching) {
        scrollRef.current?.scrollIntoView({
          behavior: "smooth"
        });
      }
    };

    autoScrollPage();
  }, [isSearching]);

  const handleSearch = async (data: DocumentSearch) => {
    try {
      const Documents = await documentApi.search(data);
      setDocuments(Documents);
      setIsSearching(true);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "Failed to fetch Document lists");
    }
  };

  const handleClearSearch = async () => {
    // reset search form (via ref)
    searchRef.current?.reset?.();

    // refetch all data
    await fetchAllDocuments();
    setIsSearching(false);
    toast.info("Search cleared");
  }

  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadCrumb
        pageTitle="Document Management"
        helpText={[
          "Use search to filter documents",
          "Click row to view details",
          "Edit/delete from table"
        ]}
      />
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
          <SearchDocument ref={searchRef} onSearch={handleSearch} />
        </ComponentCard>

        <ComponentCard title="Document Table">
          <div ref={scrollRef}>
            <DocumentTable documents={Documents} setDocuments={setDocuments} />
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
