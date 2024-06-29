'use client'
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQueries } from "@/hooks/useQueries";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@/hooks/useMutation"; // assuming this hook exists

const LayoutComponent = dynamic(() => import("../../layout/page"));

interface Note {
    id: string;
    title: string;
    description: string;
}

export default function Notes() {
    const router = useRouter();
    const {
        data: listNotes,
        isLoading,
        isError,
        refetch,
    } = useQueries({ prefixUrl: "https://service.pace-unv.cloud/api/notes" });

    const modalRef = useRef<HTMLDialogElement>(null);
    const { mutate } = useMutation();

    const [newNote, setNewNote] = useState({
        id: "",
        title: "",
        description: "",
    });

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement) {
            modalElement.addEventListener("close", handleCloseModal);
        }
        return () => {
            if (modalElement) {
                modalElement.removeEventListener("close", handleCloseModal);
            }
        };
    }, []);

    const handleOpenModal = (note: Note) => {
        const modalElement = modalRef.current;
        if (modalElement) {
            setNewNote({
                id: note.id,
                title: note.title,
                description: note.description,
            });
            modalElement.showModal();
        }
    };

    const handleCloseModal = () => {
        const modalElement = modalRef.current;
        if (modalElement) {
            modalElement.close();
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (newNote.id) {
                // If there's an id, we are updating existing note
                const response = await fetch(
                    `https://service.pace-unv.cloud/api/notes/update/${newNote.id}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            title: newNote.title,
                            description: newNote.description,
                        }),
                    }
                );
                const result = await response.json();
                if (result?.success) {
                    refetch();
                    Swal.fire({
                        title: "Success",
                        text: "Note updated successfully!",
                        icon: "success",
                    });
                    handleCloseModal();
                } else {
                    Swal.fire({
                        title: "Failed",
                        text: "Failed to update note",
                        icon: "error",
                    });
                }
            } else {
                const response = await mutate({
                    url: "https://service.pace-unv.cloud/api/notes",
                    payload: {
                        title: newNote.title,
                        description: newNote.description,
                    },
                });
                if (response?.success) {
                    refetch();
                    Swal.fire({
                        title: "Sukses",
                        text: "Data Note berhasil ditambahkan",
                        icon: "success",
                    });
                    handleCloseModal();
                } else {
                    Swal.fire({
                        title: "Gagal",
                        text: "Gagal menambahkan Data",
                        icon: "error",
                    });
                }
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Terjadi Kesalahan",
                text: "An error occurred",
                icon: "error",
            });
        }
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;
        setNewNote((prevNote) => ({
            ...prevNote,
            [name]: value,
        }));
    };

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Gagal Memuat Data</p>;

    const handleDelete = async (id: any) => {
        const deleteNote = async () => {
            try {
                const response = await fetch(
                    `https://service.pace-unv.cloud/api/notes/delete/${id}`,
                    {
                        method: "DELETE",
                    }
                );
                const result = await response.json();
                if (result?.success) {
                    refetch();
                    Swal.fire({
                        title: "Terhapus",
                        text: "Notemu berhasil di hapus!",
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "Terjadi Kesalahan!",
                        text: "Adalah masalah ketika menghapus Note ini",
                        icon: "error",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Terjadi Kesalahan!",
                    text: "Adalah masalah ketika menghapus Note ini",
                    icon: "error",
                });
            }
        };

        Swal.fire({
            title: "Apa Kamu yakin ?",
            text: "Kamu tidak bisa mengembalikan ini lagi!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteNote();
            }
        });
    };

    return (
        <LayoutComponent metaTitle="Notes">
            <div className="container mx-auto mt-3">
                <div className="flex justify-between">
                    <div>
                        <p className="text-2xl font-bold">Data Notes</p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => handleOpenModal({ id: "", title: "", description: "" })}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Tambah Data
                        </button>
                    </div>
                </div>
                <div className="max-w-full p-6 mt-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Title
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Description
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(listNotes) && listNotes.length > 0 ? (
                                listNotes.map((note: Note) => (
                                    <tr
                                        key={note.id}
                                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                            {note.title}
                                        </td>
                                        <td className="px-6 py-4">
                                            {note.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleOpenModal(note)}
                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(note.id)}
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-4">
                                        Tidak ada data yang tersedia
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <dialog id="my_modal_1" className="modal" ref={modalRef}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3 text-center">
                        {newNote.id ? "Edit Data Notes " + '\'' + newNote.title + '\'' : "Add Data Notes"}
                    </h3>
                    <form
                        className="max-w-sm mx-auto mt-3"
                        onSubmit={handleSubmit}
                    >
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newNote.title}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-5">
                            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={newNote.description}
                                onChange={handleChange}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            {newNote.id ? "Update" : "Submit"}
                        </button>
                    </form>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn" onClick={handleCloseModal}>
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </LayoutComponent>
    );
}
