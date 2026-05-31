'use client';

import { DataTable } from "../tables/data-table";
import { Document } from "../../interfaces/document";
import { recycleDocumentColumns } from "../columns/RecycleDoc";
import { documentApi } from "../../api/documentApi";
import { useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function RecycleDocumentTable({
  documents,
  setDocuments
}: {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}) {

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);

  const handleDeleteClick = (document: Document) => {
    setDeleteTarget(document);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await documentApi.deleteRecycleDocument(deleteTarget.id);
      toast.success(data.message);
      setDocuments((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleRestoreDocument = async (document : Document) =>{

    try {
      const data = await documentApi.restoreRecycleDocument(document.id);
      toast.success(data?.message);
      setDocuments((prev) =>
        prev.filter((b) => b.id !== document.id)
      );
    } catch (error:any) {
      console.log("Error : ", error);
      toast.error(error?.messsage);
    }
  }


  console.log(import.meta.env);

  return (
    <>
      <DataTable
        data={documents}
        columns={recycleDocumentColumns(handleDeleteClick, handleRestoreDocument)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete document"
        message={`Are you sure you want to delete "${deleteTarget?.document_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
