'use client';


import { DataTable } from "../tables/data-table";
import { useNavigate } from "react-router";
import { Room } from "../../interfaces/room";
import { roomColumns } from "../columns/RoomColumn";
import { roomApi } from "../../api/roomApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../common/ConfirmModal";

export default function roomTable() {
  //   const { data, error, isLoading, mutate } = useUsers();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await roomApi.all();
        console.log("this is room data", data.rooms);
        setRooms(data.rooms);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRooms();
  }, []);

  const handleDeleteClick = (room: Room) => {
  setDeleteTarget(room);
  setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const data = await roomApi.delete(deleteTarget.id);
      toast.success(data.message);
      setRooms((prev) =>
        prev.filter((b) => b.id !== deleteTarget.id)
      );

      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err?.message || "Delete failed!");
    }
  };

  const handleEditroom = async (room: Room) => {
    navigate(`/rooms/edit/${room.id}`);
  }

  return (
    <>
      <DataTable
        data={rooms}
        columns={roomColumns(handleEditroom, handleDeleteClick)}
      />
      <ConfirmModal
        isOpen={deleteOpen}
        title="Delete room"
        message={`Are you sure you want to delete "${deleteTarget?.room_name}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
