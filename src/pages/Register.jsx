import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        roles: "ROLE_SEEKER",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/api/auth/register", form);
            console.log("Form data:", form); // ← ye add karo
            navigate("/login");
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center 
            justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Register to HireFlow
                </h2>

                {error && (
                    <p className="text-red-500 text-sm mb-4">{error}</p>
                )}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            className="w-full border rounded-lg p-2"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full border rounded-lg p-2"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="w-full border rounded-lg p-2"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">
                            Register As
                        </label>
                        <select
                            name="roles"
                            className="w-full border rounded-lg p-2"
                            value={form.role}
                            onChange={handleChange}
                        >
                            <option value="ROLE_SEEKER">Job Seeker</option>
                            <option value="ROLE_COMPANY">Company</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white 
                            py-2 rounded-lg hover:bg-blue-700"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}