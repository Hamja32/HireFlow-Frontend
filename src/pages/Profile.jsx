import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import Navbar from "../components/Navbar";
import { User, Briefcase, Mail, MapPin, Calendar, Trash2, Sparkles, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  const messages = [
    { text: "Every rejection is a redirect to something better. Keep going! 🚀", emoji: "💪" },
    { text: "Your next job is looking for you too. Don't give up!", emoji: "🎯" },
    { text: "Fun fact: Even Google rejected its own co-founder once. You're in good company 😄", emoji: "😂" },
    { text: "Status: APPLIED. Mood: Nervous but make it fashion 💅", emoji: "😎" },
    { text: "They ghosted you? Their loss. The right company will reply! 👻", emoji: "✨" },
    { text: "Remember: LinkedIn says 'actively hiring' — translation: maybe in 3 months 😅", emoji: "😂" },
    { text: "You're not unemployed, you're pre-employed! 🌟", emoji: "🔥" },
    { text: "One application a day keeps the anxiety away... apply more! 😄", emoji: "💼" },
  ];

  const [message] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

  useEffect(() => {
    fetchProfile();
    fetchApplications();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/api/seeker/profile");
      setProfile(res.data);
    } catch (err) { console.error("Profile fetch failed", err); }
  };

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/api/seeker/applications");
      setApplications(res.data);
    } catch (err) { console.error("Applications fetch failed", err); }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      await axiosInstance.delete(`/api/seeker/applications/${appId}/withdraw`);
      setApplications(applications.filter((app) => app.id !== appId));
    } catch (err) { alert("Failed to withdraw application."); }
  };

  const getStatusColor = (status) => {
    const styles = {
      APPLIED: "bg-blue-50 text-blue-600 border-blue-100",
      SHORTLISTED: "bg-amber-50 text-amber-600 border-amber-100",
      INTERVIEW: "bg-purple-50 text-purple-600 border-purple-100",
      OFFERED: "bg-emerald-50 text-emerald-600 border-emerald-100",
      REJECTED: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-10">
        
        {/* Modern Motivational Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-blue-700 rounded-3xl p-8 mb-10 shadow-xl shadow-blue-100 text-white"
        >
          <div className="relative z-10 flex items-center gap-6">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl text-4xl shadow-inner">
              {message.emoji}
            </div>
            <div>
              <p className="text-blue-100 font-semibold flex items-center gap-2 mb-1 uppercase tracking-wider text-xs">
                <Sparkles size={14} /> Daily Motivation
              </p>
              <h2 className="text-xl md:text-2xl font-bold leading-tight">
                Hey {profile?.name?.split(" ")[0] || "Seeker"}, {message.text}
              </h2>
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Sidebar: User Quick Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-100 rotate-3 group-hover:rotate-0 transition-transform">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{profile?.name}</h3>
              <p className="text-gray-400 text-sm font-medium mb-4">{profile?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-blue-100">
                Active Job Seeker
              </div>
            </div>

            {/* Tab Navigation (Vertical Style) */}
            <div className="bg-white border border-gray-100 rounded-3xl p-2 shadow-sm">
              <TabButton 
                active={activeTab === "profile"} 
                onClick={() => setActiveTab("profile")} 
                icon={<User size={18}/>} 
                label="Personal Profile" 
              />
              <TabButton 
                active={activeTab === "applications"} 
                onClick={() => setActiveTab("applications")} 
                icon={<Briefcase size={18}/>} 
                label={`Applications (${applications.length})`} 
              />
            </div>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "profile" ? (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <User size={20} className="text-blue-600" /> Account Information
                  </h3>
                  <div className="space-y-6">
                    <InfoRow icon={<User size={16}/>} label="Full Name" value={profile?.name} />
                    <InfoRow icon={<Mail size={16}/>} label="Email Address" value={profile?.email} />
                    <InfoRow icon={<Briefcase size={16}/>} label="Current Role" value="Full-Stack Developer" />
                    <InfoRow icon={<MapPin size={16}/>} label="Location" value="Jodhpur, Rajasthan" />
                  </div>
                  <button className="w-full mt-8 py-3 rounded-2xl bg-gray-50 text-gray-400 font-bold text-sm border border-dashed border-gray-200 cursor-not-allowed">
                    Edit Profile (Coming Soon)
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="apps"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {applications.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Briefcase size={32} />
                      </div>
                      <p className="text-gray-500 font-medium italic">No applications yet. Fortune favors the bold!</p>
                    </div>
                  ) : (
                    applications.map((app) => (
                      <div key={app.id} className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="bg-gray-50 p-3 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <Briefcase size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.jobTitle}</h3>
                              <p className="text-sm font-semibold text-gray-500">{app.companyName}</p>
                              <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                                <span className="flex items-center gap-1"><MapPin size={12}/> {app.location}</span>
                                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(app.appliedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                            {app.status === "APPLIED" && (
                              <button
                                onClick={() => handleWithdraw(app.id)}
                                className="flex items-center gap-1 text-rose-400 hover:text-rose-600 text-xs font-bold transition-colors"
                              >
                                <Trash2 size={14} /> Withdraw
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components for Clean Code
function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-bold transition-all ${
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {active && <ChevronRight size={16} />}
    </button>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3 text-gray-400">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">{value || "Not Set"}</span>
    </div>
  );
}