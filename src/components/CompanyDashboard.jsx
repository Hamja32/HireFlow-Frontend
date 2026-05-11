import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";

export default function CompanyDashboard() {
    const [activeTab, setActiveTab] = useState("post");
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobTitle, setSelectedJobTitle] = useState(""); // Track job title for applications
    const [loading, setLoading] = useState(true);
    const [editJob, setEditJob] = useState(null);
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

    // Tab change hone par success message reset karein
    useEffect(() => {
        setSuccess("");
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const res = await axiosInstance.get("/api/company/profile");
            setCompany(res.data);
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get("/api/company/my-jobs");
            setJobs(res.data);
        } catch (err) {
            console.error("Jobs fetch error:", err);
        }
    };

    const fetchApplicationsForJob = async (jobId, jobTitle) => {
        try {
            const res = await axiosInstance.get(`/api/company/jobs/${jobId}/applications`);
            setApplications(res.data);
            setSelectedJobTitle(jobTitle);
            setActiveTab("applications");
        } catch (err) {
            alert("Failed to load applications.");
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
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
            setJobs(jobs.map((job) => (job.id === editJob.id ? { ...job, ...editJob } : job)));
            setEditJob(null);
            setSuccess("Job updated successfully!");
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
            setForm({ title: "", description: "", location: "", salary: "", skills: "" });
            fetchMyJobs();
        } catch (err) {
            console.error(err);
        } finally {
            setPosting(false);
        }
    };

    const handleStatusUpdate = async (appId, status) => {
        try {
            await axiosInstance.put(`/api/company/applications/${appId}/status?status=${status}`);
            setApplications(applications.map((app) => (app.id === appId ? { ...app, status } : app)));
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            APPLIED: "bg-blue-100 text-blue-700",
            SHORTLISTED: "bg-yellow-100 text-yellow-700",
            INTERVIEW: "bg-purple-100 text-purple-700",
            OFFERED: "bg-green-100 text-green-700",
            REJECTED: "bg-red-100 text-red-700",
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto p-8">
                {/* Company Header */}
                {company && (
                    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center gap-6 border border-gray-200">
                        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {company.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
                            <p className="text-gray-500">{company.email}</p>
                            <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full mt-1 inline-block border border-blue-100">
                                Official Company Account
                            </span>
                        </div>
                    </div>
                )}

                {/* Tabs Navigation */}
                <div className="flex gap-4 mb-6">
                    {["post", "jobs", "applications"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 capitalize shadow-sm ${
                                activeTab === tab ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                        >
                            {tab === "post" && "📝 Post a Job"}
                            {tab === "jobs" && `💼 My Jobs (${jobs.length})`}
                            {tab === "applications" && "👥 Applications"}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="transition-opacity duration-300">
                    {success && (
                        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between">
                            <span>{success}</span>
                            <button onClick={() => setSuccess("")}>&times;</button>
                        </div>
                    )}

                    {/* Post Job Tab */}
                    {activeTab === "post" && (
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h3 className="text-xl font-bold mb-6 text-gray-800">Create New Job Opening</h3>
                            <form onSubmit={handlePostJob} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Job Title</label>
                                        <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Java Developer" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                        <textarea name="description" value={form.description} onChange={handleChange} rows={4} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe the role..." required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                                        <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Remote / City" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Salary Range</label>
                                        <input type="text" name="salary" value={form.salary} onChange={handleChange} className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 5LPA - 8LPA" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Required Skills</label>
                                        <input type="text" name="skills" value={form.skills} onChange={handleChange} placeholder="Java, Spring Boot, React..." className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                    </div>
                                </div>
                                <button type="submit" disabled={posting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400 mt-2">
                                    {posting ? "Posting Job..." : "Publish Job Opening"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* My Jobs Tab */}
                    {activeTab === "jobs" && (
                        <div className="space-y-4">
                            {jobs.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
                                    <div className="text-4xl mb-3">📦</div>
                                    <p className="text-gray-500 font-medium">No jobs posted yet. Start hiring today!</p>
                                </div>
                            ) : (
                                jobs.map((job) => (
                                    <div key={job.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:border-blue-300 transition-colors">
                                        {editJob?.id === job.id ? (
                                            <form onSubmit={handleUpdateJob} className="space-y-3">
                                                <input className="w-full border rounded-lg p-2 font-bold" value={editJob.title} onChange={(e) => setEditJob({ ...editJob, title: e.target.value })} required />
                                                <textarea className="w-full border rounded-lg p-2" value={editJob.description} onChange={(e) => setEditJob({ ...editJob, description: e.target.value })} rows={3} required />
                                                <div className="flex gap-3">
                                                    <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Update</button>
                                                    <button type="button" onClick={() => setEditJob(null)} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                        <span className="text-gray-500 text-sm flex items-center">📍 {job.location}</span>
                                                        <span className="text-gray-500 text-sm flex items-center">💰 {job.salary}</span>
                                                    </div>
                                                    <div className="mt-2 flex gap-2">
                                                        {job.skills.split(',').map(skill => (
                                                            <span key={skill} className="bg-gray-100 text-gray-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={() => setEditJob(job)} className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit Job">✏️ Edit</button>
                                                    <button onClick={() => fetchApplicationsForJob(job.id, job.title)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100">View Applicants</button>
                                                    <button onClick={() => handleDeleteJob(job.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job">🗑️</button>
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
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-bold text-gray-700">
                                    {selectedJobTitle ? `Applications for: ${selectedJobTitle}` : "All Applications"}
                                </h3>
                                {selectedJobTitle && (
                                    <button onClick={() => {setSelectedJobTitle(""); setApplications([])}} className="text-sm text-blue-600 hover:underline">Clear Filter</button>
                                )}
                            </div>
                            {applications.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-gray-200">
                                    No applications found for this criteria.
                                </div>
                            ) : (
                                applications.map((app) => (
                                    <div key={app.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                                {app.applicantName?.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">{app.applicantName}</h3>
                                                <p className="text-gray-500 text-sm">{app.applicantEmail}</p>
                                                <div className="mt-1">
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${getStatusColor(app.status)}`}>
                                                        {app.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Update Status:</label>
                                            <select 
                                                value={app.status} 
                                                onChange={(e) => handleStatusUpdate(app.id, e.target.value)} 
                                                className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white shadow-sm"
                                            >
                                                <option value="APPLIED">Applied</option>
                                                <option value="SHORTLISTED">Shortlisted</option>
                                                <option value="INTERVIEW">Interview</option>
                                                <option value="OFFERED">Offered</option>
                                                <option value="REJECTED">Rejected</option>
                                            </select>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}