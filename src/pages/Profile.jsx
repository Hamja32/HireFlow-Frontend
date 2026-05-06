import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        fetchProfile();
        fetchApplications();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/api/seeker/profile");
    
            
            setProfile(res.data);
        } catch (err) {
            console.error("Profile fetch failed", err);
        }
    };

    const fetchApplications = async () => {
        try {
            const res = await axiosInstance.get("/api/seeker/applications");
            setApplications(res.data);
        } catch (err) {
            console.error("Applications fetch failed", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "APPLIED": return "bg-blue-100 text-blue-700";
            case "SHORTLISTED": return "bg-yellow-100 text-yellow-700";
            case "INTERVIEW": return "bg-purple-100 text-purple-700";
            case "OFFERED": return "bg-green-100 text-green-700";
            case "REJECTED": return "bg-red-100 text-red-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-3xl mx-auto">

                {/* Profile Card */}
                {profile && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6 
                        flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-blue-600 
                            flex items-center justify-center text-white 
                            text-2xl font-bold">
                            {profile.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {profile.name}
                            </h2>
                            <p className="text-gray-500">{profile.email}</p>
                            <span className="text-xs bg-blue-100 
                                text-blue-700 px-2 py-1 rounded-full mt-1 
                                inline-block">
                                Job Seeker
                            </span>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-4 py-2 rounded-lg font-medium 
                            ${activeTab === "profile"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 shadow"
                            }`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab("applications")}
                        className={`px-4 py-2 rounded-lg font-medium 
                            ${activeTab === "applications"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 shadow"
                            }`}
                    >
                        My Applications ({applications.length})
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === "profile" && profile && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold mb-4">
                            Personal Details
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between 
                                border-b pb-2">
                                <span className="text-gray-500">Name</span>
                                <span className="font-medium">
                                    {profile.name}
                                </span>
                            </div>
                            <div className="flex justify-between 
                                border-b pb-2">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium">
                                    {profile.email}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role</span>
                                <span className="font-medium">
                                    Job Seeker
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-md 
                                p-6 text-center text-gray-500">
                                No applications yet. Start applying! 🚀
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div key={app.id}
                                    className="bg-white rounded-xl 
                                        shadow-md p-6">
                                    <div className="flex justify-between 
                                        items-start">
                                        <div>
                                            <h3 className="text-lg 
                                                font-bold">
                                                {app.jobTitle}
                                            </h3>
                                            <p className="text-gray-500 
                                                text-sm">
                                                {app.companyName}
                                            </p>
                                            <p className="text-gray-500 
                                                text-sm">
                                                📍 {app.location}
                                            </p>
                                            <p className="text-gray-400 
                                                text-xs mt-1">
                                                Applied: {new Date(
                                                    app.appliedAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 
                                            rounded-full text-xs font-medium 
                                            ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}