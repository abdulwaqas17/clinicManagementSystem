"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Stethoscope,
  Calendar,
  Home,
  FileText,
  User,
  Bell,
  Menu,
  X,
  Building,
} from "lucide-react";
import { getDashboardData } from "@/services/dashboardServices";
import { useProfileContext } from "@/context/profileContext";
import { useUsersContext } from "@/context/usersContext";
import { useRoomContext } from "@/context/roomContext";
import { useAppointmentContext } from "@/context/appointmentContext";
import { useDoctorContext } from "@/context/doctorContext";
import { useReceptionistContext } from "@/context/receptionistContext";
import { useCaseHistoryContext } from "@/context/caseHistoryContext";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, setProfile } = useProfileContext();
  const { setUsers } = useUsersContext();
  const { setRooms } = useRoomContext();
  const { setAppointments } = useAppointmentContext();
  const { setDoctors } = useDoctorContext();
  const { setReceptionists } = useReceptionistContext();
  const { setCaseHistory } = useCaseHistoryContext();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const data = await getDashboardData(token);
        
        toast.success("Dashboard data loaded!");
        setProfile(data.profile || null);
        setUsers(data.users || []);
        setRooms(data.rooms || []);
        setAppointments(data.appointments || []);
        setDoctors(data.doctors || []);
        setReceptionists(data.receptionists || []);
        setCaseHistory(data.caseHistory || []);

      } catch (error) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "receptionist", "doctor","user"] },
    { name: "Users", href: "/dashboard/users", icon: Users, roles: ["admin", "receptionist"] },
    { name: "Staff", href: "/dashboard/staff", icon: UserCheck, roles: ["admin"] },
    { name: "Doctors", href: "/dashboard/doctors", icon: Stethoscope, roles: ["admin", "receptionist","user"] },
    { name: "Appointments", href: "/dashboard/appointments", icon: Calendar, roles: ["admin", "receptionist", "doctor","user"] },
    { name: "Rooms", href: "/dashboard/rooms", icon: Home, roles: ["admin", "receptionist"] },
    { name: "Case History", href: "/dashboard/case-history", icon: FileText, roles: ["admin", "receptionist","user"] },
    { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["admin", "receptionist", "doctor","user"] },
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(profile?.role)
  );

  console.log('====================================');
  console.log(profile);
  console.log('====================================');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">ClinicPro</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="ml-3">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.firstName || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {profile?.role || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {profile?.role || "role"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">{children}</div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
