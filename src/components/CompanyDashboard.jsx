import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";

export default function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState("post");
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editJob, setEditJob] = useState(null); // jo job edit ho rahi hai
    const [form, setForm] = useState({
        title: "",
        description: "",
        location: "",
        salary: "",
        skills: "",
    });
    const [posting, setPosting] = useState(false);
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProfile();
        fetchMyJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/api/company/profile");
            setCompany(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyJobs = async () => {
    try {
        const res = await axiosInstance.get("/api/company/my-jobs");
        setJobs(res.data);
    } catch (err) {
        console.error(err);
    }
};

    const fetchApplicationsForJob = async (jobId) => {
        try {
            const res = await axiosInstance.get(
                `/api/company/jobs/${jobId}/applications`
            );
            setApplications(res.data);
            setActiveTab("applications");
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
        await axiosInstance.delete(`/api/company/jobs/${jobId}`);
        setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
        alert("Failed to delete job.");
    }
};

const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
        await axiosInstance.put(`/api/company/jobs/${editJob.id}`, editJob);
        setJobs(jobs.map((job) => 
            job.id === editJob.id ? { ...job, ...editJob } : job
        ));
        setEditJob(null);
    } catch (err) {
        alert("Failed to update job.");
    }
};
    const handlePostJob = async (e) => {
        e.preventDefault();
        setPosting(true);
        try {
            await axiosInstance.post("/api/company/jobs", form);
            setSuccess("Job posted successfully! 🎉");
            setForm({
                title: "",
                description: "",
                location: "",
                salary: "",
                skills: "",
            });
            fetchMyJobs();
        } catch (err) {
            console.error(err);
        } finally {
            setPosting(false);
        }
    };

    const handleStatusUpdate = async (appId, status) => {
        try {
            await axiosInstance.put(
                `/api/company/applications/${appId}/status?status=${status}`
            );
            setApplications(applications.map((app) =>
                app.id === appId ? { ...app, status } : app
            ));
        } catch (err) {
            console.error(err);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600
                    border-t-transparent rounded-full animate-spin">
                </div>
            </div>
        );
    }

    return <>
    <div className="min-h-screen bg-gray-100">
          <Navbar />

            <div className="max-w-5xl mx-auto p-8">

                {/* Company Header */}
                {company && (
                    <div className="bg-white rounded-xl shadow-md p-6 
                        mb-6 flex items-center gap-6">
                        <div className="w-16 h-16 rounded-full 
                            bg-blue-600 flex items-center justify-center 
                            text-white text-2xl font-bold">
                            {company.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {company.name}
                            </h2>
                            <p className="text-gray-500">{company.email}</p>
                            <span className="text-xs bg-blue-100 
                                text-blue-700 px-2 py-1 rounded-full 
                                mt-1 inline-block">
                                Company
                            </span>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-6">
                    {["post", "jobs", "applications"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium 
                                capitalize ${activeTab === tab
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-600 shadow"
                                }`}
                        >
                            {tab === "post" && "📝 Post a Job"}
                            {tab === "jobs" && `💼 My Jobs (${jobs.length})`}
                            {tab === "applications" && "👥 Applications"}
                        </button>
                    ))}
                </div>

                {/* Post Job Tab */}
                {activeTab === "post" && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Post a New Job
                        </h3>

                        {success && (
                            <p className="text-green-600 bg-green-50 
                                p-3 rounded-lg mb-4">
                                {success}
                            </p>
                        )}

                        <form onSubmit={handlePostJob} 
                            className="space-y-4">
                            <div>
                                <label className="block text-sm 
                                    font-medium mb-1">Job Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm 
                                    font-medium mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm 
                                        font-medium mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        className="w-full border 
                                            rounded-lg p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm 
                                        font-medium mb-1">Salary</label>
                                    <input
                                        type="text"
                                        name="salary"
                                        value={form.salary}
                                        onChange={handleChange}
                                        className="w-full border 
                                            rounded-lg p-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm 
                                    font-medium mb-1">
                                    Skills Required
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={form.skills}
                                    onChange={handleChange}
                                    placeholder="Java, Spring Boot, MySQL"
                                    className="w-full border rounded-lg p-2"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={posting}
                                className="w-full bg-blue-600 text-white 
                                    py-2 rounded-lg hover:bg-blue-700 
                                    disabled:opacity-60"
                            >
                                {posting ? "Posting..." : "Post Job"}
                            </button>
                        </form>
                    </div>
                )}

              {activeTab === "jobs" && (
    <div className="space-y-4">
        {jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 
                text-center text-gray-500">
                No jobs posted yet. Post your first job! 🚀
            </div>
        ) : (
            jobs.map((job) => (
                <div key={job.id}
                    className="bg-white rounded-xl shadow-md p-6">
                    
                    {/* Edit Mode */}
                    {editJob?.id === job.id ? (
                        <form onSubmit={handleUpdateJob} 
                            className="space-y-3">
                            <input
                                className="w-full border rounded-lg p-2"
                                value={editJob.title}
                                onChange={(e) => setEditJob({
                                    ...editJob, title: e.target.value
                                })}
                                placeholder="Job Title"
                                required
                            />
                            <textarea
                                className="w-full border rounded-lg p-2"
                                value={editJob.description}
                                onChange={(e) => setEditJob({
                                    ...editJob, description: e.target.value
                                })}
                                placeholder="Description"
                                rows={2}
                                required
                            />
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    className="border rounded-lg p-2"
                                    value={editJob.location}
                                    onChange={(e) => setEditJob({
                                        ...editJob, location: e.target.value
                                    })}
                                    placeholder="Location"
                                    required
                                />
                                <input
                                    className="border rounded-lg p-2"
                                    value={editJob.salary}
                                    onChange={(e) => setEditJob({
                                        ...editJob, salary: e.target.value
                                    })}
                                    placeholder="Salary"
                                    required
                                />
                            </div>
                            <input
                                className="w-full border rounded-lg p-2"
                                value={editJob.skills}
                                onChange={(e) => setEditJob({
                                    ...editJob, skills: e.target.value
                                })}
                                placeholder="Skills"
                                required
                            />
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white 
                                        px-4 py-2 rounded-lg 
                                        hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditJob(null)}
                                    className="bg-gray-200 text-gray-700 
                                        px-4 py-2 rounded-lg 
                                        hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Normal View
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold">
                                    {job.title}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                    📍 {job.location} | 💰 {job.salary}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    🛠 {job.skills}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditJob(job)}
                                    className="bg-yellow-400 text-white 
                                        px-3 py-2 rounded-lg 
                                        hover:bg-yellow-500 text-sm"
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => 
                                        fetchApplicationsForJob(job.id)}
                                    className="bg-blue-600 text-white 
                                        px-3 py-2 rounded-lg 
                                        hover:bg-blue-700 text-sm"
                                >
                                    👥 Applications
                                </button>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="bg-red-500 text-white 
                                        px-3 py-2 rounded-lg 
                                        hover:bg-red-600 text-sm"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))
        )}
    </div>
)}

                {/* Applications Tab */}
                {activeTab === "applications" && (
                    <div className="space-y-4">
                        {applications.length === 0 ? (
                            <div className="bg-white rounded-xl 
                                shadow-md p-6 text-center text-gray-500">
                                No applications yet.
                            </div>
                        ) : (
                            applications.map((app) => (
                                <div key={app.id}
                                    className="bg-white rounded-xl 
                                        shadow-md p-6 flex justify-between 
                                        items-center">
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {app.applicantName}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {app.applicantEmail}
                                        </p>
                                        <span className={`text-xs px-2 py-1 
                                            rounded-full font-medium 
                                            ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <select
                                        value={app.status}
                                        onChange={(e) =>
                                            handleStatusUpdate(
                                                app.id, e.target.value
                                            )
                                        }
                                        className="border rounded-lg p-2 
                                            text-sm"
                                    >
                                        <option value="APPLIED">Applied</option>
                                        <option value="SHORTLISTED">
                                            Shortlisted
                                        </option>
                                        <option value="INTERVIEW">
                                            Interview
                                        </option>
                                        <option value="OFFERED">Offered</option>
                                        <option value="REJECTED">
                                            Rejected
                                        </option>
                                    </select>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    </>
    
    
}