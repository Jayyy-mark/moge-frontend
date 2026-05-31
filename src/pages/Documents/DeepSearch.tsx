import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import DeepSearchFilter from "../../components/deepsearch/DeepSearchFilters";
import Button from "../../components/ui/button/Button";

import {
    Search,
    Download,
    FileText,
    FileSpreadsheet,
    FileImage,
    FileArchive,
    Presentation,
    Eye,
    X,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { DeepSearchDocument, DeepSearchDocumentResponse } from "../../interfaces/document";
import { documentApi } from "../../api/documentApi";
import { toast } from "react-toastify";
import { helper } from "../../helpers/utils";

export default function DeepSearchDocuments() {
    const searchRef = useRef<any>(null);

    const [documents, setDocuments] = useState<DeepSearchDocumentResponse[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [selectedDoc, setSelectedDoc] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (isSearching) {
            scrollRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [isSearching]);

    const handleSearch = async (data: DeepSearchDocument) => {
        try {
            const documents = await documentApi.deepSearch(data);

            setDocuments(documents);

            setIsSearching(true);
        } catch (error: any) {
            toast.error(error?.message || "Failed to search documents");
        }
    };

    const handleClearSearch = async () => {
        searchRef.current?.reset?.();

        setDocuments([]);

        setIsSearching(false);

        toast.info("Search cleared");
    };

    const handleDownload = (doc: any) => {
        toast.success("downloaded", doc);
    };

    const handleViewMatches = (doc: any) => {
        setSelectedDoc(doc);
        setOpenModal(true);
    };

    // FILE ICON BY EXTENSION
    const getFileIcon = (filename?: string) => {
        
        if (!filename) {
            return <FileText className="h-12 w-12 text-gray-500" />;
        }

        const ext = filename.split(".").pop()?.toLowerCase();

        switch (ext) {
            case "pdf":
                return <FileText className="h-12 w-12 text-red-500" />;

            case "doc":
            case "docx":
                return <FileText className="h-12 w-12 text-blue-500" />;

            case "xls":
            case "xlsx":
            case "csv":
                return <FileSpreadsheet className="h-12 w-12 text-green-500" />;

            case "ppt":
            case "pptx":
                return <Presentation className="h-12 w-12 text-orange-500" />;

            case "png":
            case "jpg":
            case "jpeg":
                return <FileImage className="h-12 w-12 text-pink-500" />;

            case "zip":
            case "rar":
                return <FileArchive className="h-12 w-12 text-yellow-500" />;

            default:
                return <FileText className="h-12 w-12 text-gray-500" />;
        }
    };

    return (
        <>
            <PageMeta
                title="Deep Search Documents"
                description="AI deep search document system"
            />

            <PageBreadCrumb
                pageTitle="Document Management"
                helpText={[
                    "Use AI search to find document contents",
                    "View matched lines and pages",
                    "Download documents instantly",
                ]}
            />

            <div className="space-y-6">
                {/* SEARCH */}
                <ComponentCard
                    title="Search Documents"
                    footerChildren={
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="primary"
                                onClick={() => searchRef.current?.submit()}
                                className="flex items-center gap-1 px-2 py-1 text-[13px]"
                            >
                                <Search size={15} />
                                <span className="hidden sm:inline">
                                    Search
                                </span>
                            </Button>

                            {isSearching && (
                                <Button
                                    size="sm"
                                    variant="info"
                                    onClick={handleClearSearch}
                                    className="flex items-center gap-1 px-2 py-1 text-[13px]"
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    }
                >
                    <DeepSearchFilter
                        ref={searchRef}
                        onSearch={handleSearch}
                    />
                </ComponentCard>

                {/* RESULT CARDS */}
                <ComponentCard title="Matched Documents">
                    <div
                        ref={scrollRef}
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    >
                        {documents.map((doc: any) => (
                            
                            <div
                                key={doc.id}
                                className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                {/* MATCH COUNT */}
                                <div className="absolute right-4 top-4 rounded-full bg-pink-100 px-3 py-1 text-xs font-bold text-pink-600">
                                    {doc.matches?.length || 0} Matches
                                </div>

                                {/* CONTENT */}
                                <div className="p-6">
                                    {/* FILE ICON */}
                                    <div className="mb-5 flex justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gray-100">
                                            {getFileIcon(doc.filename)}
                                        </div>
                                    </div>

                                    {/* FILE NAME */}
                                    <h3 className="line-clamp-2 text-center text-lg font-bold text-gray-800">
                                        {doc.filename}
                                    </h3>

                                    {/* DEPARTMENT */}
                                    <p className="mt-1 text-center text-sm text-gray-500">
                                        {doc.department_name}
                                    </p>

                                    {/* DETAILS */}
                                    <div className="mt-6 space-y-3 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">
                                                Uploaded:
                                            </span>

                                            <span>
                                                {helper.formatStrDate(doc.uploaded_at)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="font-semibold">
                                                Category:
                                            </span>

                                            <span>
                                                {doc.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* BUTTONS */}
                                <div className="grid grid-cols-2 border-t border-gray-100">
                                    {/* SHOW MATCHES */}
                                    <button
                                        onClick={() => handleViewMatches(doc)}
                                        className="flex items-center justify-center gap-2 border-r border-gray-100 px-4 py-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                                    >
                                        <Eye size={16} />
                                        Matches
                                    </button>

                                    {/* DOWNLOAD */}
                                    <button
                                        onClick={() => handleDownload(doc)}
                                        className="flex items-center justify-center gap-2 px-4 py-4 text-sm font-semibold text-green-600 transition hover:bg-green-50"
                                    >
                                        <Download size={16} />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </ComponentCard>
            </div>

            {/* MATCH MODAL */}
            {openModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Match Results
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {selectedDoc?.filename}
                                </p>
                            </div>

                            <button
                                onClick={() => setOpenModal(false)}
                                className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-4">
                            {selectedDoc?.matches?.length > 0 ? (
                                selectedDoc.matches.map(
                                    (match: any, index: number) => (
                                        <div
                                            key={index}
                                            className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                                        >
                                            {/* PAGE + LINE */}
                                            <div className="mb-3 flex items-center gap-3 text-sm">
                                                <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                                                    Page {match.page}
                                                </span>

                                                <span className="rounded-full bg-pink-100 px-3 py-1 font-semibold text-pink-700">
                                                    Line {match.line}
                                                </span>
                                            </div>

                                            {/* TEXT */}
                                            <p className="leading-7 text-gray-700">
                                                {match.text}
                                            </p>
                                        </div>
                                    )
                                )
                            ) : (
                                <div className="py-10 text-center text-gray-500">
                                    No matched text found.
                                </div>
                            )}
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-end border-t border-gray-200 px-6 py-4">
                            <Button
                                variant="primary"
                                onClick={() => handleDownload(selectedDoc)}
                                className="flex items-center gap-2"
                            >
                                <Download size={16} />
                                Download File
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}