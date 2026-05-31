'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Document } from "../../interfaces/document";
import { documentColumns } from "../columns/DocumentColumns";
import { documentApi } from "../../api/documentApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";
import { pluralize } from "../../helpers/utils";

export default function DocumentTable({
  documents,
  setDocuments
}: {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
}) {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Document | null>(null);
  {/** <==========notification section start============> */ }
  const [notificationModalOpen, setnotificationModalOpen] = useState(false);
  const [expiredDocumentCount, setExpiredDocumentsCount] = useState<number | null>(null);
  const [openActionId, setOpenActionId] = useState<number | null>(null);


  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("expired_doc_noti");

    if (alreadyShown) return;

    const fetchExpiredDocuments = async () => {
      try {
        const documents = await documentApi.getExpiredDocuments();

        if (documents.length > 0) {
          setExpiredDocumentsCount(documents.length);
          setnotificationModalOpen(true);

          sessionStorage.setItem("expired_doc_noti", "true");
        }
      } catch (error: any) {
        toast.error(error?.message || "error occured!");
      }
    };

    fetchExpiredDocuments();
  }, []);

  const handleDeleteClick = (document: Document) => {
    setDeleteTarget(document);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await documentApi.delete(deleteTarget.id);
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

  const handleArchiveDocument = async (document: Document) => {

    try {
      const data = await documentApi.archive(document.id);
      toast.success(data?.message);
      setDocuments((prev) =>
        prev.filter((b) => b.id !== document.id)
      );
    } catch (error: any) {
      console.log("Error : ", error);
      toast.error(error?.messsage);
    }
  }

  const handleEditDocument = async (document: Document) => {
    navigate(`/documents/edit/${document.id}`);
  }

  return (
    <>
      <DataTable
        data={documents}
        columns={documentColumns(handleEditDocument, handleDeleteClick, handleArchiveDocument, openActionId, setOpenActionId)}
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

      <ConfirmModal
        isOpen={notificationModalOpen}
        title="Notification"
        message={`There ${pluralize(expiredDocumentCount || 0, "is", "are")} ${expiredDocumentCount} ${pluralize(expiredDocumentCount||0, "document", "documents")} 
        which ${pluralize(expiredDocumentCount||0, "is", "are")} already expired and about to be moved to recycle bin, 
        you can recheck them later!`
        }
        confirmText="Check"
        cancelText="Close"
        type="info"
        onConfirm={confirmDelete}
        onCancel={() => {
          setnotificationModalOpen(false);
        }}
      />
    </>
  );
}
