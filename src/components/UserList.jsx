import React, { useEffect, useState } from "react";
import { deleteUser, fetchUsers } from "../api/api";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [deletedUsers, setDeletedUsers] = useState(() => {
        const storedDeletedUsers = localStorage.getItem("deletedUsers");
        return storedDeletedUsers ? JSON.parse(storedDeletedUsers) : [];
    }); 
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [sortField, setSortField] = useState("first_name");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
        try {
            const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
            if (storedUsers.length > 0) {
            setUsers(storedUsers);
            } else {
            const { data } = await fetchUsers(page);
            const sortedData = sortUsers(data.data, "first_name", sortOrder);
            setUsers(sortedData);
            localStorage.setItem("users", JSON.stringify(sortedData)); 
            }
        } catch {
            setError("Failed to fetch users.");
        }
        };

        fetchData();
    }, [page, sortField,sortOrder]);

    useEffect(() => {
        localStorage.setItem("deletedUsers", JSON.stringify(deletedUsers));
    }, [deletedUsers]);


    const sortUsers = (userData, field, order) => {
        return [...userData].sort((a, b) => {
        const valueA = a[field].toLowerCase();
        const valueB = b[field].toLowerCase();

        return order === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });
    };


    const handleSort = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        const sortedUsers = sortUsers(users, "first_name", sortOrder === "asc" ? "desc" : "asc");
        setUsers(sortedUsers);
        localStorage.setItem("users", JSON.stringify(sortedUsers));
    };

    const filteredUsers = users
        .filter((user) => !deletedUsers.includes(user.id)) 
        .filter(
        (user) =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    const handleDelete = async (id) => {
        try {
        await deleteUser(id);
        setDeletedUsers((prev) => [...prev, id]); 
        const updatedUsers = users.filter((user) => user.id !== id);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers)); 
        } catch {
        alert("Failed to delete user.");
        }
    };


    return (
        <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">User Management</h1>
            <div className="flex space-x-4 items-center">
            <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="hidden sm:block p-2 rounded-md border border-gray-300 text-black focus:ring focus:ring-blue-300"
            />
            <button
                onClick={handleSort}
                className="hidden sm:flex bg-white text-blue-500 hover:bg-blue-100 p-2 rounded-md items-center"
            >
                <ArrowUpDown className="mr-2" />
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
            >
                Logout
            </button>
            </div>
        </header>
        <div className="sm:hidden flex justify-between">
            <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded-lg border border-black text-black focus:ring focus:ring-blue-300 w-3/4"
            />
            <button
            onClick={handleSort}
            className="bg-white text-blue-500 hover:bg-blue-100 p-2 rounded-md items-center flex"
            >
            <ArrowUpDown className="mr-2" />
            {sortOrder === "asc" ? "A-Z" : "Z-A"}
            </button>
        </div>
        <main className="max-w-6xl mx-auto py-8">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white shadow-md rounded-md p-4 flex flex-col items-center">
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="w-24 h-24 rounded-full mb-4" />
                <h3 className="font-bold text-lg">
                    {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-500 text-sm">{user.email}</p>
                <div className="mt-4 flex space-x-2">
                    <button
                    onClick={() => navigate(`/edit/${user.id}`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-md"
                    >
                    Edit
                    </button>
                    <button
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-3 rounded-md"
                    >
                    View
                    </button>
                    <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md"
                    >
                    Delete
                    </button>
                </div>
                </div>
            ))}
            </div>
            <div className="flex justify-center mt-6 space-x-4">
            <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className={`py-2 px-4 rounded-md font-bold ${
                page === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                disabled={page === 1}
            >
                Previous
            </button>
            <button
                onClick={() => setPage((prev) => prev + 1)}
                className="py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-bold"
            >
                Next
            </button>
            </div>
        </main>
        </div>
    );
};

export default UserList;
