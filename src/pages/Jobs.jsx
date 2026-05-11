import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { Search, MapPin, Briefcase, DollarSign, Cpu, Calendar, RefreshCcw } from "lucide-react"; // Modern Icons

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState({ location: "", skills: "" });
    const [activeTag, setActiveTag] = useState("");
    const [loading, setLoading] = useState(true);

    const skillTags = ["Java", "Spring Boot", "React", "Python", "MySQL", "Node.js", "Express Js", "MERN Stack", "Laravel", "MEAN Stack"];

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/api/seeker/jobs");
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await axiosInstance.post(`/api/seeker/jobs/${jobId}/apply`);
            alert("Applied successfully! 🚀");
        } catch (err) {
            alert("Already applied or error occurred.");
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        try {
            const res = await axiosInstance.get("/api/seeker/jobs/search", {
                params: {
                    location: search.location || null,
                    skills: search.skills || null,
                },
            });
            setJobs(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReset = () => {
        setSearch({ location: "", skills: "" });
        setActiveTag("");
        fetchJobs();
    };

    const handleTagClick = (skill) => {
        const newSkill = activeTag === skill ? "" : skill;
        setActiveTag(newSkill);
        setSearch({ ...search, skills: newSkill });
        // Auto search on tag click
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Finding best jobs for you...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* Hero & Search Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Explore <span className="text-blue-600">Opportunities</span>
                        </h1>
                        <p className="text-gray-500 mt-2 font-medium">Find your dream role in Jodhpur or Remote</p>
                    </div>

                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-end">
                            <div className="flex-1 relative group">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block ml-1">Location</label>
                                <div className="relative">
                                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Jaipur, Remote..."
                                        value={search.location}
                                        onChange={(e) => setSearch({ ...search, location: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex-1 relative group">
                                <label className="text-xs font-bold text-gray-400 uppercase mb-1.5 block ml-1">Key Skills</label>
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Java, React, Hibernate..."
                                        value={search.skills}
                                        onChange={(e) => setSearch({ ...search, skills: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 h-[46px]">
                                <button type="submit" className="bg-blue-600 text-white px-8 rounded-xl hover:bg-blue-700 font-bold text-sm shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
                                    <Search size={18} /> Search
                                </button>
                                <button type="button" onClick={handleReset} className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-400 transition-all">
                                    <RefreshCcw size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Fast Filter Tags */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar pt-2">
                            {skillTags.map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => handleTagClick(skill)}
                                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                                        activeTag === skill
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </div>

            {/* Job Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold text-gray-800">
                        {jobs.length > 0 ? `Showing ${jobs.length} jobs` : "No jobs found"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <div key={job.id} className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                        <Briefcase size={24} />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded">Full Time</span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                                <p className="text-gray-500 font-medium text-sm flex items-center gap-1.5 mt-1">
                                    🏢 {job.companyName}
                                </p>

                                <div className="mt-4 space-y-2.5">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                        <MapPin size={16} className="text-gray-400" /> {job.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                                        <DollarSign size={16} /> {job.salary}
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-500 text-sm font-medium">
                                        <Cpu size={16} className="text-gray-400 mt-0.5" /> 
                                        <span className="line-clamp-1">{job.skills}</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed mt-4 line-clamp-3">
                                    {job.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-50">
                                <div className="flex items-center justify-between mb-4 text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} /> Posted {formatDate(job.createdAt)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleApply(job.id)}
                                    className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95"
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}