import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axiosInstance.get("/api/seeker/jobs");
                console.log("Response:", res); // ← ye add karo temporarily

                setJobs(res.data);
            } catch (err) {
                setError("Failed to load jobs.");
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId) => {
        try {
            await axiosInstance.post(`/api/seeker/jobs/${jobId}/apply`);
            alert("Applied Successfully!");
        } catch (err) {
            alert("Already applied or error occurred.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
    <h2 className="text-3xl font-bold">Available Jobs</h2>
    <a href="/profile" 
        className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        My Profile
    </a>
</div>
         

            {error && (
                <p className="text-red-500 text-center">{error}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 
                lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job.id}
                        className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold mb-1">
                            {job.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-1">
                            {job.companyName}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            📍 {job.location}
                        </p>
                        <p className="text-gray-500 text-sm mb-1">
                            💰 {job.salary}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                            🛠 {job.skills}
                        </p>
                        <p className="text-gray-700 text-sm mb-4">
                            {job.description}
                        </p>
                        <button
                            onClick={() => handleApply(job.id)}
                            className="w-full bg-blue-600 text-white 
                                py-2 rounded-lg hover:bg-blue-700"
                        >
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}