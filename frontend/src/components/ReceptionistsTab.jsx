"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Users,
  Search,
  Edit,
  Mail,
  Phone,
  Calendar,
  User,
  Eye,
  Trash2,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
import { useReceptionistContext } from "@/context/receptionistContext";
import { useProfileContext } from "@/context/profileContext";
import toast from "react-hot-toast";
import NotFound from "@/app/not-found";
import { inviteReceptionist } from "@/services/addMemberServices";
import { AddUserModal } from "./inviteModal";
import EditUserModal from "./UserEditModal";

export default function ReceptionistManagement() {
  const { receptionists, setReceptionists } = useReceptionistContext();
  const { profile } = useProfileContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  if (!profile.role.includes["admin"]) {
    NotFound();
  }

  // Handle sort
  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  }, []);

  // Calculate age from date of birth
  const calculateAge = useCallback((dateOfBirth) => {
    if (!dateOfBirth) return "N/A";

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }, []);

  // Filter and search receptionists
  const filteredReceptionists = useMemo(() => {
    if (!receptionists || !Array.isArray(receptionists)) return [];

    let result = [...receptionists];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        (receptionist) =>
          receptionist.firstName?.toLowerCase().includes(lowercasedSearch) ||
          receptionist.lastName?.toLowerCase().includes(lowercasedSearch) ||
          receptionist.email?.toLowerCase().includes(lowercasedSearch) ||
          receptionist.phone?.includes(searchTerm) ||
          receptionist.employeeId?.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (receptionist) => receptionist.status === statusFilter
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "name") {
          const nameA = `${a.firstName || ""} ${a.lastName || ""}`
            .toLowerCase()
            .trim();
          const nameB = `${b.firstName || ""} ${b.lastName || ""}`
            .toLowerCase()
            .trim();
          return sortConfig.direction === "asc"
            ? nameA.localeCompare(nameB)
            : nameB.localeCompare(nameA);
        }
        if (sortConfig.key === "createdAt") {
          const dateA = new Date(a.createdAt || "");
          const dateB = new Date(b.createdAt || "");
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
        if (sortConfig.key === "status") {
          return sortConfig.direction === "asc"
            ? (a.status || "").localeCompare(b.status || "")
            : (b.status || "").localeCompare(a.status || "");
        }
        return 0;
      });
    }

    return result;
  }, [receptionists, searchTerm, statusFilter, sortConfig]);

  // Get status icon and color
  const getStatusInfo = useCallback((status) => {
    switch (status) {
      case "active":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-100",
          text: "Active",
        };
      case "invited":
        return {
          icon: XCircle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          text: "Invited",
        };
      case "disabled":
        return {
          icon: Clock,
          color: "text-red-500",
          bgColor: "bg-red-100",
          text: "Disabled",
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          text: "Unknown",
        };
    }
  }, []);

  // Format date for display
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  // Handle edit user
  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);
  
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Receptionist Management
          </h1>
          <p className="text-gray-600 mt-1">
            {receptionists?.length || 0} receptionists in system
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Receptionist</span>
        </button>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search receptionists by name, email, phone, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="disabled">Disabled</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receptionists Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Receptionist</span>
                    {sortConfig.key === "name" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact & Details
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Employment</span>
                    {sortConfig.key === "createdAt" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    {sortConfig.key === "status" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReceptionists.map((receptionist) => {
                const StatusIcon = getStatusInfo(receptionist.status).icon;
                const age = calculateAge(receptionist.date_of_birth);

                return (
                  <tr
                    key={receptionist._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Receptionist Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                          {receptionist.profileImage ? (
                            <img
                              src={receptionist.profileImage}
                              alt={`${receptionist.firstName} ${receptionist.lastName}`}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {receptionist.firstName} {receptionist.lastName}
                          </div>

                          <div className="text-xs text-gray-400 capitalize">
                            {receptionist.gender || "Not specified"} • {age}{" "}
                            years
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact & Details */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{receptionist.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{receptionist.phone || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Employment Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(receptionist.createdAt)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusInfo(receptionist.status).bgColor
                        } ${getStatusInfo(receptionist.status).color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{getStatusInfo(receptionist.status).text}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(receptionist)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {/* <button
                          onClick={() => handleDelete(receptionist._id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredReceptionists.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No receptionists found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "Get started by adding your first receptionist"}
            </p>
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        role="receptionist"
        receptionists={receptionists}
        setReceptionists={setReceptionists}
      />

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
          role="receptionist"
          selectedUser={selectedUser}
          setReceptionists={setReceptionists}  
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
