import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { Bell, LogOut, Briefcase, User, LayoutDashboard, Menu, X } from "lucide-react"; // Modern Icons
import { motion, AnimatePresence } from "framer-motion"; // Smooth transitions

export default function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    let role = null;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            role = payload.role;
        } catch (e) {
            console.error("Token parsing error", e);
        }
    }

    useEffect(() => {
        if (token && role === "ROLE_SEEKER") {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [token, role]);

    // Dropdown ko bahar click karne par close karne ke liye
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await axiosInstance.get("/api/notifications/unread-count");
            setUnreadCount(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchNotifications = async () => {
        try {
            const res = await axiosInstance.get("/api/notifications");
            setNotifications(res.data);
            await axiosInstance.put("/api/notifications/mark-read");
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    };

    const handleBellClick = () => {
        const nextState = !showDropdown;
        setShowDropdown(nextState);
        if (nextState) fetchNotifications();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
        });
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            
            {/* Logo Section */}
            <div
                onClick={() => role === "ROLE_COMPANY" ? navigate("/company/dashboard") : navigate("/jobs")}
                className="flex items-center gap-2 cursor-pointer group"
            >
                <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-6 transition-transform">
                    <Briefcase size={22} className="text-white" />
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-xl font-bold tracking-tight text-gray-900">
                        Hire<span className="text-blue-600">Flow</span>
                    </span>
                </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2 md:gap-6">
                
                {token && role === "ROLE_COMPANY" && (
                    <div className="hidden md:flex gap-4">
                        <NavLink onClick={() => navigate("/company/dashboard")} icon={<LayoutDashboard size={18}/>} label="Dashboard" />
                        <NavLink onClick={() => navigate("/jobs")} icon={<Briefcase size={18}/>} label="All Jobs" />
                    </div>
                )}

                {token && role === "ROLE_SEEKER" && (
                    <div className="hidden md:flex gap-4">
                        <NavLink onClick={() => navigate("/jobs")} icon={<Briefcase size={18}/>} label="Jobs" />
                        <NavLink onClick={() => navigate("/profile")} icon={<User size={18}/>} label="Profile" />
                    </div>
                )}

                {/* Right Side Actions */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    {token && role === "ROLE_SEEKER" && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={handleBellClick}
                                className={`p-2 rounded-full transition-all ${showDropdown ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                            >
                                <Bell size={22} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold ring-2 ring-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Modern Dropdown with Animation */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                                            {unreadCount > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">New</span>}
                                        </div>
                                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="py-10 text-center">
                                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <Bell size={20} className="text-gray-300" />
                                                    </div>
                                                    <p className="text-gray-400 text-sm">All caught up!</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div key={notif.id} className={`p-4 border-b border-gray-50 transition-colors hover:bg-gray-50 cursor-default ${!notif.read ? "bg-blue-50/40" : ""}`}>
                                                        <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>
                                                        <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                                                            {formatTime(notif.createdAt)}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {!token ? (
                        <>
                            <button onClick={() => navigate("/register")} className="hidden md:block text-sm font-semibold text-gray-600 hover:text-blue-600 px-4 py-2">
                                Register
                            </button>
                            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 text-sm font-bold">
                                Login
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-xl transition-all text-sm font-bold border border-gray-100"
                        >
                            <LogOut size={16} />
                            <span className="hidden md:block">Logout</span>
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

// Reusable Nav Component for clean code
function NavLink({ onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-all font-semibold text-sm"
        >
            {icon}
            {label}
        </button>
    );
}