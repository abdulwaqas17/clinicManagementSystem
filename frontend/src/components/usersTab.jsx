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
} from "lucide-react";
import { useUsersContext } from "@/context/usersContext";
import { useProfileContext } from "@/context/profileContext";
import NotFound from "@/app/not-found";
import EditUserModal from "./UserEditModal";

// Import your actual context
export default function UsersManagement() {
  const { users , setUsers} = useUsersContext();
  const { profile } = useProfileContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  if (!profile.role.includes[("receptionist", "admin")]) {
    NotFound();
  }

  // Calculate age from date of birth - useCallback to prevent recreation
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

  // Filter and search users - useMemo to prevent unnecessary recalculations
  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];

    let result = [...users];

    // Apply search filter
    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        (user) =>
          user.firstName?.toLowerCase().includes(lowercasedSearch) ||
          user.lastName?.toLowerCase().includes(lowercasedSearch) ||
          user.email?.toLowerCase().includes(lowercasedSearch) ||
          user.phone?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter);
    }

    // Apply gender filter
    if (genderFilter !== "all") {
      result = result.filter((user) => user.gender === genderFilter);
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
        if (sortConfig.key === "age") {
          const ageA = calculateAge(a.date_of_birth);
          const ageB = calculateAge(b.date_of_birth);
          return sortConfig.direction === "asc" ? ageA - ageB : ageB - ageA;
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
  }, [users, searchTerm, statusFilter, genderFilter, sortConfig, calculateAge]);

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

  // Handle edit user
  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  }, []);

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
      case "disabled":
        return {
          icon: XCircle,
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
    return new Date(dateString).toLocaleDateString();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-1">
            {users?.length || 0} patients found
          </p>
        </div>
        {/* <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button> */}
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
                placeholder="Search patients by name, email, or phone..."
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
              <option value="disabled">Disabled</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
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
                    <span>Patient</span>
                    {sortConfig.key === "name" && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("age")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Age</span>
                    {sortConfig.key === "age" && (
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
              {filteredUsers.map((user) => {
                const StatusIcon = getStatusInfo(user.status).icon;
                const age = calculateAge(user.date_of_birth);

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Patient Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 capitalize">
                            {user.gender || "Not specified"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-900">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{user.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone || "N/A"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Age */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{age} years</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(user.date_of_birth)}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusInfo(user.status).bgColor
                        } ${getStatusInfo(user.status).color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        <span>{getStatusInfo(user.status).text}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700">
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        {/* <button className="flex items-center space-x-1 text-red-600 hover:text-red-700">
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-lg">No patients found</p>
            <p className="text-gray-400 text-sm mt-1">
              {searchTerm || statusFilter !== "all" || genderFilter !== "all"
                ? "Try adjusting your filters or search terms"
                : "No patients available in the system"}
            </p>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
        <EditUserModal
        role="user"
          selectedUser={selectedUser}
          setUsers={setUsers}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// // Edit User Modal Component
// function EditUserModal({ user, onSave, onClose }) {
//   const [formData, setFormData] = useState({
//     firstName: user.firstName || "",
//     lastName: user.lastName || "",
//     email: user.email || "",
//     phone: user.phone || "",
//     date_of_birth: user.date_of_birth || "",
//     gender: user.gender || "male",
//     status: user.status || "active",
//     address: user.address || "",
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave({ ...user, ...formData });
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <h2 className="text-xl font-bold text-gray-900">Edit Patient</h2>
//           <p className="text-gray-600 mt-1">Update patient information</p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 First Name *
//               </label>
//               <input
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Last Name *
//               </label>
//               <input
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Date of Birth *
//               </label>
//               <input
//                 type="date"
//                 name="date_of_birth"
//                 value={formData.date_of_birth}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Gender *
//               </label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//               <option value="pending">Pending</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address
//             </label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
