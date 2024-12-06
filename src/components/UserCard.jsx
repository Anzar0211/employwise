import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUsers } from "../api/api";

const UserCard = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await fetchUsers(1); // Assuming users are paginated
        const selectedUser = data.data.find((u) => u.id === parseInt(id));
        if (selectedUser) setUser(selectedUser);
        else setError("User not found.");
      } catch {
        setError("Failed to fetch user.");
      }
    };
    fetchUser();
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {user ? (
        <div className="bg-white shadow-md rounded-md p-6 w-full max-w-sm">
          <img
            src={user.avatar}
            alt={`${user.first_name} ${user.last_name}`}
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h2 className="text-xl font-bold text-center mt-4">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500 text-center">{user.email}</p>
          <button
            onClick={() => navigate("/users")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-6 rounded-md w-full"
          >
            Back to Users
          </button>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default UserCard;
