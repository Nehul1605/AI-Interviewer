import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 LayoutDashboard,
 Users,
 FileText,
 UserCheck,
 MessageSquare,
 User,
 LogOut,
 Zap,
 Bell,
 PieChart as PieChartIcon,
 Briefcase,
 ChevronRight,
 TrendingUp,
 X,
 Send,
} from "lucide-react";
import {
 PieChart,
 Pie,
 Cell,
 ResponsiveContainer,
 Tooltip as RechartsTooltip,
} from "recharts";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";

type StatData = { name: string; value: number };

interface HRDashboardData {
 userName: string;
 offerLetterData: StatData[];
 interviewStats: StatData[];
 jobDeptData: StatData[];
 announcements: {
 id: string;
 date: string;
 message: string;
 active?: boolean;
 }[];
 workStatus: { office: number; home: number };
 notifications: { apps: number; reports: number; messages: number };
}

const COLORS = ["#ffffff", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export function HRDashboard() {
 const [activeTab, setActiveTab] = useState("dashboard");
 const [data, setData] = useState<HRDashboardData | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);

 // Announcement states
 const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
 const [newAnnouncement, setNewAnnouncement] = useState("");
 const [isPublishing, setIsPublishing] = useState(false);

 useEffect(() => {
 const fetchDashboardData = async () => {
 try {
 setIsLoading(true);
 const response = await fetch("/api/hr/dashboard").catch(() => null);
 if (response && response.ok) {
 const result = await response.json();
 setData(result);
 } else {
 setData(null);
 }
 } catch (err) {
 setError("Failed to connect to database");
 } finally {
 setIsLoading(false);
 }
 };

 fetchDashboardData();
 }, []);

 const handlePublishAnnouncement = async () => {
 if (!newAnnouncement.trim()) return;

 setIsPublishing(true);
 try {
 // Simulate API call to save announcement
 // await fetch("/api/hr/announcements", {
 // method: "POST",
 // body: JSON.stringify({ message: newAnnouncement }),
 // });

 const newEntry = {
 id: Date.now().toString(),
 message: newAnnouncement,
 date: new Date()
 .toLocaleDateString("en-US", {
 month: "short",
 day: "numeric",
 year: "numeric",
 })
 .toUpperCase(),
 active: true,
 };

 // Update local state for demo purposes
 if (data) {
 setData({
 ...data,
 announcements: [newEntry, ...data.announcements],
 });
 } else {
 // Fallback if data is null (empty state)
 setData({
 userName: "HR Admin",
 offerLetterData: [
 { name: "Accepted", value: 42 },
 { name: "Pending", value: 28 },
 { name: "Expired", value: 15 },
 ],
 interviewStats: [
 { name: "Interviews Taken", value: 45 },
 { name: "Total Applications", value: 120 },
 { name: "Hired Candidates", value: 12 },
 ],
 jobDeptData: [
 { name: "Engineering", value: 40 },
 { name: "Design", value: 25 },
 { name: "Marketing", value: 20 },
 { name: "HR", value: 15 },
 ],
 announcements: [newEntry],
 workStatus: { office: 65, home: 35 },
 notifications: { apps: 12, reports: 5, messages: 3 },
 });
 }

 setNewAnnouncement("");
 console.log("Announcement published successfully");
 toast.success("Announcement published successfully", {
 description: "It is now visible to all employees.",
 style: {
 background: "rgba(0,0,0,0.8)",
 color: "#fff",
 border: "1px solid rgba(255,255,255,0.1)",
 backdropFilter: "blur(10px)",
 },
 });
 } catch (err) {
 console.error("Failed to publish", err);
 toast.error("Failed to publish announcement");
 } finally {
 setIsPublishing(false);
 }
 };

 if (isLoading) {
 return (
 <div className="min-h-screen bg-black flex items-center justify-center">
 <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
 </div>
 );
 }

 const {
 userName = "HR Admin",
 notifications = { apps: 12, reports: 5, messages: 3 },
 workStatus = { office: 65, home: 35 },
 announcements = [],
 interviewStats = [
 { name: "Interviews Taken", value: 45 },
 { name: "Total Applications", value: 120 },
 { name: "Hired Candidates", value: 12 },
 ],
 offerLetterData = [
 { name: "Accepted", value: 42 },
 { name: "Pending", value: 28 },
 { name: "Expired", value: 15 },
 ],
 jobDeptData = [
 { name: "Engineering", value: 40 },
 { name: "Design", value: 25 },
 { name: "Marketing", value: 20 },
 { name: "HR", value: 15 },
 ],
 } = data && Object.keys(data).length > 0 ? data : {};

 return (
 <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white/20">
 {/* Background Effects */}

 <div className="fixed inset-0 z-0 pointer-events-none">
 <div className="absolute top-20 left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
 <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
 </div>

 {/* Sidebar - Matching the image layout */}
 <aside className="w-20 lg:w-72 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen z-40">
 <div className="p-8 flex items-center gap-3">
 <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/5 shrink-0">
 <Zap className="text-black fill-black" size={18} />
 </div>
 <span className="font-black text-lg tracking-tight text-white hidden lg:block uppercase">
 {userName || "AI Interviewer"}
 </span>
 </div>

 <nav className="flex-1 px-4 space-y-1.5 mt-4">
 <SidebarLink
 icon={<LayoutDashboard size={20} />}
 label="Dashboard"
 active={activeTab === "dashboard"}
 onClick={() => setActiveTab("dashboard")}
 />
 <SidebarLink
 icon={<Users size={20} />}
 label="Employees"
 active={activeTab === "employees"}
 onClick={() => setActiveTab("employees")}
 />
 <SidebarLink
 icon={<FileText size={20} />}
 label="Applications"
 active={activeTab === "applications"}
 onClick={() => setActiveTab("applications")}
 />
 <SidebarLink
 icon={<UserCheck size={20} />}
 label="Recruited P"
 active={activeTab === "recruited"}
 onClick={() => setActiveTab("recruited")}
 />
 <SidebarLink
 icon={<MessageSquare size={20} />}
 label="Messages"
 active={activeTab === "messages"}
 onClick={() => setActiveTab("messages")}
 />
 <SidebarLink
 icon={<User size={20} />}
 label="Profile"
 active={activeTab === "profile"}
 onClick={() => setActiveTab("profile")}
 />
 </nav>

 <div className="p-6 border-t border-white/10">
 <SidebarLink
 icon={<LogOut size={20} />}
 label="Logout"
 onClick={() => (window.location.href = "/")}
 />
 </div>
 </aside>

 {/* Main Content */}
 <main className="flex-1 px-8 lg:px-12 py-10 overflow-y-auto relative z-10">
 <header className="flex items-center justify-end mb-10">
 <div className="h-12 w-12 rounded-full border border-white/20 shadow-sm bg-white/10 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
 <Avatar className="h-full w-full">
 <AvatarImage src="" />
 <AvatarFallback className="bg-white/10 text-white font-bold">
 HR
 </AvatarFallback>
 </Avatar>
 </div>
 </header>

 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
 {/* Welcome Card - Balanced Layout with consistent padding */}
 <Card className="lg:col-span-2 border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8 flex flex-col justify-between min-h-[160px]">
 <div className="space-y-1">
 <h2 className="text-2xl font-bold text-white tracking-tight">
 Welcome back, {userName || "HR"}
 </h2>
 <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
 Dashboard Overview
 </p>
 </div>

 <div className="flex items-center justify-between mt-6">
 <p className="text-gray-400 text-sm font-medium">
 Since your last login:
 </p>
 <ul className="flex gap-8">
 <li className="flex flex-col items-center">
 <span className="text-2xl font-bold text-white leading-none">
 {notifications.apps}
 </span>
 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
 New Apps
 </span>
 </li>
 <hr className="w-[1px] h-8 bg-white/10 border-none" />
 <li className="flex flex-col items-center">
 <span className="text-2xl font-bold text-white leading-none">
 {notifications.reports}
 </span>
 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
 Reports
 </span>
 </li>
 <hr className="w-[1px] h-8 bg-white/10 border-none" />
 <li className="flex flex-col items-center">
 <span className="text-2xl font-bold text-white leading-none">
 {notifications.messages}
 </span>
 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
 Messages
 </span>
 </li>
 </ul>
 </div>
 </Card>

 {/* Work Status Card - Shrinked horizontally */}
 <Card className="lg:col-span-1 border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-6">
 <CardHeader className="p-0 mb-4">
 <CardTitle className="text-sm font-bold text-white uppercase tracking-widest opacity-70">
 Work status
 </CardTitle>
 </CardHeader>
 <div className="space-y-3">
 <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
 <span className="text-xs font-medium text-gray-400">
 Office
 </span>
 <span className="text-sm font-bold text-white">
 {workStatus.office}%
 </span>
 </div>
 <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
 <span className="text-xs font-medium text-gray-400">Home</span>
 <span className="text-sm font-bold text-white">
 {workStatus.home}%
 </span>
 </div>
 </div>
 </Card>

 {/* Announcement Card - Integrated Input Form */}
 <Card className="lg:col-span-1 border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-5 flex flex-col relative overflow-hidden group">
 <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
 <CardTitle className="text-xs font-bold text-white uppercase tracking-widest opacity-70">
 Announce
 </CardTitle>
 <Bell size={14} className="text-gray-400" />
 </CardHeader>

 <div className="flex flex-col gap-3 h-full">
 {/* Message Input Area */}
 <div className="relative group/input">
 <Textarea
 value={newAnnouncement}
 onChange={(e) => setNewAnnouncement(e.target.value)}
 placeholder="Type a quick announcement..."
 className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[80px] text-[11px] resize-none focus:ring-1 focus:ring-white/30 rounded-2xl pr-8 custom-scrollbar transition-all"
 />
 <button
 onClick={handlePublishAnnouncement}
 disabled={!newAnnouncement.trim() || isPublishing}
 className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:hover:bg-white transition-all transform active:scale-90"
 >
 {isPublishing ? (
 <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
 ) : (
 <Send size={12} className="fill-current" />
 )}
 </button>
 </div>

 {/* Feed Preview - ONLY LATEST ONE */}
 <div className="flex-1 overflow-hidden mt-2">
 {announcements && announcements.length > 0 ? (
 <motion.div
 initial={{ opacity: 0, y: 5 }}
 animate={{ opacity: 1, y: 0 }}
 key={announcements[0].id || 0}
 className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg transition-all hover:bg-white/[0.08]"
 >
 <div className="flex justify-between items-center mb-2.5">
 <div className="flex items-center gap-2">
 <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
 <span className="text-[9px] font-bold font-mono text-white/40 tracking-widest uppercase">
 {announcements[0].date || "LATEST POST"}
 </span>
 </div>
 <span className="text-[9px] px-2 py-0.5 rounded-md bg-blue-500 text-white font-black tracking-tighter">
 NEW
 </span>
 </div>
 <p className="text-sm text-white/90 leading-relaxed font-medium">
 {announcements[0].message}
 </p>
 </motion.div>
 ) : (
 <p className="text-[10px] text-gray-500 italic text-center py-2">
 No announcements yet
 </p>
 )}
 </div>
 </div>
 </Card>
 </div>

 {/* New Announcement Modal - REMOVED since we have inline input */}

 {/* Bottom grid (3 columns) */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
 {/* Pie Chart Stats Card */}
 <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8">
 <CardHeader className="p-0 mb-4">
 <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
 <PieChartIcon size={20} />
 Interview Metrics
 </CardTitle>
 </CardHeader>
 <div className="h-[200px] w-full">
 {interviewStats.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={interviewStats}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {interviewStats.map((entry, index) => (
 <Cell
 key={`cell-${index}`}
 fill={COLORS[(index + 1) % COLORS.length]}
 />
 ))}
 </Pie>
 <RechartsTooltip
 contentStyle={{
 backgroundColor: "rgba(0,0,0,0.9)",
 border: "1px solid rgba(255,255,255,0.2)",
 borderRadius: "16px",
 color: "#fff",
 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
 backdropFilter: "blur(12px)",
 }}
 itemStyle={{ color: "#fff", fontWeight: "bold" }}
 />
 </PieChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
 No stats available
 </div>
 )}
 </div>
 <div className="space-y-2 mt-4">
 {interviewStats.map((stat, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between text-xs"
 >
 <div className="flex items-center gap-2">
 <div
 className="w-2 h-2 rounded-full"
 style={{
 backgroundColor: COLORS[(idx + 1) % COLORS.length],
 }}
 />
 <span className="text-gray-400">{stat.name}</span>
 </div>
 <span className="font-bold">{stat.value}</span>
 </div>
 ))}
 </div>
 </Card>

 {/* Offer Letter Card - NOW WITH PIE CHART */}
 <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8">
 <CardHeader className="p-0 mb-4">
 <CardTitle className="text-lg font-bold flex items-center gap-2 text-white">
 <FileText size={20} />
 Offer Letters
 </CardTitle>
 </CardHeader>
 <div className="h-[200px] w-full">
 {offerLetterData.length > 0 ? (
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={offerLetterData}
 cx="50%"
 cy="50%"
 innerRadius={60}
 outerRadius={80}
 paddingAngle={5}
 dataKey="value"
 >
 {offerLetterData.map((entry, index) => (
 <Cell
 key={`cell-${index}`}
 fill={
 entry.name === "Accepted"
 ? "#10b981"
 : entry.name === "Pending"
 ? "#f59e0b"
 : "#ef4444"
 }
 />
 ))}
 </Pie>
 <RechartsTooltip
 contentStyle={{
 backgroundColor: "rgba(0,0,0,0.9)",
 border: "1px solid rgba(255,255,255,0.2)",
 borderRadius: "16px",
 color: "#fff",
 boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
 backdropFilter: "blur(12px)",
 }}
 itemStyle={{ color: "#fff", fontWeight: "bold" }}
 />
 </PieChart>
 </ResponsiveContainer>
 ) : (
 <div className="h-full flex items-center justify-center text-gray-500 text-xs italic">
 No stats available
 </div>
 )}
 </div>
 <div className="space-y-2 mt-4">
 {offerLetterData.map((stat, idx) => (
 <div
 key={idx}
 className="flex items-center justify-between text-xs"
 >
 <div className="flex items-center gap-2">
 <div
 className="w-2 h-2 rounded-full"
 style={{
 backgroundColor:
 stat.name === "Accepted"
 ? "#10b981"
 : stat.name === "Pending"
 ? "#f59e0b"
 : "#ef4444",
 }}
 />
 <span className="text-gray-400">{stat.name}</span>
 </div>
 <span className="font-bold">{stat.value}</span>
 </div>
 ))}
 </div>
 </Card>

 {/* Job Post Dept % Card */}
 <Card className="border border-white/10 shadow-sm rounded-3xl bg-white/5 backdrop-blur-md p-8">
 <CardHeader className="p-0 mb-6">
 <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
 <Briefcase size={20} />
 Job post dept %
 </CardTitle>
 </CardHeader>
 <div className="space-y-4">
 {jobDeptData.map((dept, idx) => (
 <div key={idx} className="space-y-1.5">
 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
 <span>{dept.name}</span>
 <span>{dept.value}%</span>
 </div>
 <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
 <motion.div
 initial={{ width: 0 }}
 animate={{ width: `${dept.value}%` }}
 transition={{ duration: 1, ease: "easeOut" }}
 className="h-full bg-white/80"
 />
 </div>
 </div>
 ))}
 {jobDeptData.length === 0 && (
 <p className="text-[10px] text-gray-500 italic">
 No job post data
 </p>
 )}
 </div>
 </Card>
 </div>
 </main>
 </div>
 );
}

// Reuse SidebarLink from Dashboard or define here for local use
function SidebarLink({
 icon,
 label,
 active = false,
 onClick,
}: {
 icon: React.ReactNode;
 label: string;
 active?: boolean;
 onClick?: () => void;
}) {
 return (
 <button
 onClick={onClick}
 className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
 active
 ? "bg-white/10 text-white shadow-lg shadow-black/5"
 : "text-gray-400 hover:bg-white/5 hover:text-white"
 }`}
 >
 <div
 className={`${active ? "text-white" : "group-hover:text-white opacity-70 group-hover:opacity-100"}`}
 >
 {icon}
 </div>
 <span
 className={`font-bold text-sm hidden lg:block ${active ? "text-white" : ""}`}
 >
 {label}
 </span>
 </button>
 );
}