import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser } from '../api/api';

const EditUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await fetchUsers(1);
        const selectedUser = data.data.find((u) => u.id === parseInt(id));
        if (selectedUser) setUser(selectedUser);
        else setError('User not found');
      } catch {
        setError('Failed to load user details.');
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedData = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      };

      console.log("Submitting data:", updatedData);
      const response = await updateUser(id, updatedData);
      console.log("API Response:", response.data);

      navigate('/users');
    } catch (error) {
      console.error("Error updating user:", error.message);
      setError('Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Edit User</h2>
        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="first_name"
              type="text"
              value={user.first_name || ''}
              onChange={(e) => setUser({ ...user, first_name: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="last_name"
              type="text"
              value={user.last_name || ''}
              onChange={(e) => setUser({ ...user, last_name: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email || ''}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`py-2 px-4 rounded-md font-bold ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
