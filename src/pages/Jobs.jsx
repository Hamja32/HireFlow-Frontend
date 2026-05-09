import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";

// import Navbar from "../components/Navbar";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState({ location: "", skills: "" });
   const [activeTag, setActiveTag] = useState("");
    const [loading, setLoading] = useState(true);
const skillTags = ["Java", "Spring Boot", "React", "Python", "MySQL", "Node.js","Express Js","MERN Stack","Laravel","MEAN Stack"];
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
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
           alert("Applied success");
        } catch (err) {
            alert("Already applied or error occurred.");
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };
    
const handleSearch = async (e) => {
    e.preventDefault();
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
    setSearch({ ...search, skills: skill });
    setActiveTag(skill);
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

    return (
        
        <div className="min-h-screen bg-gray-100">
        
    <Navbar />
 {/* Search Bar */}
<div className="bg-white rounded-xl border border-gray-100 p-5 mb-8">
    <p className="text-xs font-medium text-orange-400 uppercase 
        tracking-wider mb-3 ">
        Find your next opportunity
    </p>

    <form onSubmit={handleSearch}>
        <div className="flex gap-3 items-end">
            <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                    Location
                </label>
                <input
                    type="text"
                    placeholder="e.g. Jaipur, Remote"
                    value={search.location}
                    onChange={(e) => setSearch({
                        ...search, location: e.target.value
                    })}
                    className="w-full border border-gray-200 
                        rounded-lg px-3 py-2 text-sm 
                        focus:outline-none focus:border-blue-400"
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                    Skills
                </label>
                <input
                    type="text"
                    placeholder="e.g. Java, React, MySQL"
                    value={search.skills}
                    onChange={(e) => setSearch({
                        ...search, skills: e.target.value
                    })}
                    className="w-full border border-gray-200 
                        rounded-lg px-3 py-2 text-sm 
                        focus:outline-none focus:border-blue-400"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-5 py-2 
                    rounded-lg hover:bg-blue-700 text-sm 
                    font-medium flex items-center gap-2"
            >
                🔍 Search
            </button>
            <button
                type="button"
                onClick={handleReset}
                className="border border-gray-200 text-gray-500 
                    px-4 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
                Reset
            </button>
        </div>

        {/* Quick Skill Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
            {skillTags.map((skill) => (
                <span
                    key={skill}
                    onClick={() => handleTagClick(skill)}
                    className={`text-xs px-3 py-1 rounded-full 
                        cursor-pointer border transition-all
                        ${activeTag === skill
                            ? "bg-blue-50 text-blue-600 border-blue-300 font-medium"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                        }`}
                >
                    {skill}
                </span>
            ))}
        </div>
    </form>
</div>
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    Available Jobs
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 
                    lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id}
                            className="bg-white rounded-xl shadow-md p-6 
                                flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">
                                    {job.title}
                                </h3>
                                <p className="text-gray-500 text-sm mb-1">
                                    🏢 {job.companyName}
                                </p>
                                <p className="text-gray-500 text-sm mb-1">
                                    📍 {job.location}
                                </p>
                                <p className="text-gray-500 text-sm mb-1">
                                    💰 {job.salary}
                                </p>
                                <p className="text-gray-600 text-sm mb-1">
                                    🛠 {job.skills}
                                </p>
                                <p className="text-gray-700 text-sm mb-3">
                                    {job.description}
                                </p>
                                <p className="text-gray-400 text-xs mb-4">
                                    📅 Posted: {formatDate(job.createdAt)}
                                </p>
                            </div>

                           <button
    onClick={() => handleApply(job.id)}
    className="w-full bg-blue-600 
        text-white py-2 rounded-lg 
        hover:bg-blue-700 font-medium"
>
    Apply Now
</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}