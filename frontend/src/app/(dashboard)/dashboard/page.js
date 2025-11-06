"use client";

import React from "react";

import AdminDashboardOverview from "@/components/adminOverview";
import DoctorDashboardOverview from "@/components/doctorOverview";
import ReceptionistDashboardOverview from "@/components/receptionistOveriew";
import UserDashboardOverview from "@/components/userOverview";
import { useProfileContext } from "@/context/profileContext";

const Page = () => {
  const { profile } = useProfileContext();
  const role = profile?.role;

  if (!role) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 font-medium">Loading user role...</p>
      </div>
    );
  }

  return (
    <div>
      {role === "admin" && <AdminDashboardOverview />}
      {role === "doctor" && <DoctorDashboardOverview />}
      {role === "receptionist" && <ReceptionistDashboardOverview />}
      {role === "user" && <UserDashboardOverview />}
    </div>
  );
};

export default Page;
