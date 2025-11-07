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


export default function ReceptionistManagement() {
  const { receptionists,setReceptionists } = useReceptionistContext();
  const { profile } = useProfileContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  if (!profile.role.includes["admin"]) {
    NotFound();
  }

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
        if (sortConfig.key === "joinDate") {
          const dateA = new Date(a.joinDate || "");
          const dateB = new Date(b.joinDate || "");
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
        <button onClick={()=> setIsAddModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
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
                  onClick={() => handleSort("joinDate")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Employment</span>
                    {sortConfig.key === "joinDate" && (
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
                        <button
                          onClick={() => handleDelete(receptionist._id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

        <AddReceptionistModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
          }}
          
      
        />
      
    </div>
  );
}



export function AddReceptionistModal({ isOpen, onClose }) {
    const { receptionists,setReceptionists } = useReceptionistContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User not authenticated");
      }
      const payload = { ...formData, role: "receptionist" };

      const res = await inviteReceptionist(payload, token);
      toast.success(res.message || "Receptionist invited successfully");

      setReceptionists((prev) => [...prev, res.user]);
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        profileImage: null,
      });

    } catch (error) {
      toast.error(error.message || "Failed to invite receptionist");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Receptionist
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-600"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}