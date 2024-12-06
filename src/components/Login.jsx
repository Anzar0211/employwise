import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); 
    try {
      const { data } = await login({ email, password });
      if(password!=="cityslicka"){
        setError("Invalid credentials. Try again!");
        setLoading(false);
        return;
      }
      console.log("Login successful, token:", data.token); 
      localStorage.setItem("token", data.token);
      setLoading(false); 
      window.location.href = "/users";
    } catch (err) {
      console.log(err.message);
      setError("Invalid credentials. Try again!");
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center md:mx-20 py-auto h-screen">
      <div className="min-h-full flex flex-col justify-center items-center text-sm md:w-1/2">
        <form
          onSubmit={handleLogin}
          className="flex flex-col md:w-2/3 border-2 p-10"
        >
          <h1 className="font-bold text-2xl text-blue-900">Login</h1>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <label className="font-bold mt-8" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
          <label className="font-bold mt-8" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            value={password}
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="border border-gray-500 p-3 rounded focus:outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center p-2 mt-4 text-white font-bold rounded-md ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
              "Login"
            )}
          </button>
          <p className="mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-500 underline">
              Register
            </Link>
          </p>
        </form>
      </div>
      <img
        src="https://img.freepik.com/premium-vector/time-management-concept-can-use-web-banner-infographics-hero-images-isometric-vector-modern_566886-5282.jpg"
        width={500}
        height={1000}
        alt="image"
        className="w-1/2 h-auto my-auto hidden md:block"
      />
    </div>
  );
};

export default Login;
