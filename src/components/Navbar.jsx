import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    
    // Token se role nikalo
    let role = null;
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        role = payload.role;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md px-8 py-4 flex 
            justify-between items-center sticky top-0 z-50">

            {/* Logo */}
            <div
                onClick={() => role === "ROLE_COMPANY"
                    ? navigate("/company/dashboard")
                    : navigate("/jobs")}
                className="flex items-center gap-2 cursor-pointer"
            >
                <span className="text-2xl font-black text-blue-600">
                    Hire
                </span>
                <span className="text-2xl font-black text-gray-800">
                    Flow
                </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">

                {/* COMPANY links */}
                {token && role === "ROLE_COMPANY" && (
                    <>
                        <span
                            onClick={() => navigate("/company/dashboard")}
                            className="text-gray-600 hover:text-blue-600 
                                cursor-pointer font-medium"
                        >
                            Dashboard
                        </span>
                        <span
                            onClick={() => navigate("/jobs")}
                            className="text-gray-600 hover:text-blue-600 
                                cursor-pointer font-medium"
                        >
                            All Jobs
                        </span>
                    </>
                )}

                {/* SEEKER links */}
                {token && role === "ROLE_SEEKER" && (
                    <>
                        <span
                            onClick={() => navigate("/jobs")}
                            className="text-gray-600 hover:text-blue-600 
                                cursor-pointer font-medium"
                        >
                            Jobs
                        </span>
                        <span
                            onClick={() => navigate("/profile")}
                            className="text-gray-600 hover:text-blue-600 
                                cursor-pointer font-medium"
                        >
                            Profile
                        </span>
                    </>
                )}

                {/* Not logged in */}
                {!token && (
                    <>
                        <span
                            onClick={() => navigate("/register")}
                            className="text-gray-600 hover:text-blue-600 
                                cursor-pointer font-medium"
                        >
                            Register
                        </span>
                        <button
                            onClick={() => navigate("/login")}
                            className="bg-blue-600 text-white px-4 py-2 
                                rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Login
                        </button>
                    </>
                )}

                {/* Logout — sirf logged in users ke liye */}
                {token && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 
                            rounded-lg hover:bg-red-600 font-medium"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}