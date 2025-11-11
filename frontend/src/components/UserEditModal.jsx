"use client";

import { useRoomContext } from "@/context/roomContext";
import { updateUserProfile } from "@/services/usersServices";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Trash2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

const EditUserModal = ({
  onClose,
  role,
  selectedUser,
  setUsers,
  setDoctors,
  setReceptionists,
}) => {
  const { rooms } = useRoomContext();

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    status: "active",
    profileImage: null,
    doctorInfo: {
      specialization: "",
      doctorRoom: "",
      experience: "",
      consultationFee: "",
      schedule: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
    },
  });

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Prefill user data when editing
  useEffect(() => {
    if (selectedUser) {
      const userData = {
        ...selectedUser,
        doctorInfo: selectedUser.doctorInfo || {
          specialization: "",
          doctorRoom: "",
          experience: "",
          consultationFee: "",
          schedule: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
        },
      };
      
      setFormData(userData);
      
      // Set image preview if profile image exists
      if (selectedUser.profileImage) {
        setImagePreview(selectedUser.profileImage);
      }
    }
  }, [selectedUser]);

  // Common input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("doctorInfo.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        doctorInfo: { ...prev.doctorInfo, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle schedule change
  const handleScheduleChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSchedule = [...prev.doctorInfo.schedule];
      updatedSchedule[index][field] = value;
      return {
        ...prev,
        doctorInfo: {
          ...prev.doctorInfo,
          schedule: updatedSchedule,
        },
      };
    });
  };

  // Add new schedule slot
  const addScheduleRow = () => {
    setFormData((prev) => ({
      ...prev,
      doctorInfo: {
        ...prev.doctorInfo,
        schedule: [
          ...prev.doctorInfo.schedule,
          { day: "Monday", startTime: "09:00", endTime: "17:00" },
        ],
      },
    }));
  };

  // Remove schedule slot
  const removeScheduleRow = (index) => {
    if (formData.doctorInfo.schedule.length > 1) {
      setFormData((prev) => {
        const updatedSchedule = prev.doctorInfo.schedule.filter(
          (_, i) => i !== index
        );
        return {
          ...prev,
          doctorInfo: { ...prev.doctorInfo, schedule: updatedSchedule },
        };
      });
    }
  };

  // Handle file input with preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Clear image preview
  const clearImagePreview = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, profileImage: null }));
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // Validate before submit
  const validateForm = () => {
    if (
      !formData.firstName?.trim() ||
      !formData.email?.trim() ||
      !formData.phone?.trim() ||
      !formData.gender ||
      !formData.date_of_birth ||
      !formData.address?.trim()
    ) {
      toast.error("Please fill all required fields!");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return false;
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
      toast.error("Please enter a valid phone number!");
      return false;
    }

    if (role === "doctor") {
      const { specialization, doctorRoom, schedule, consultationFee } =
        formData.doctorInfo;
      if (!specialization?.trim() || !doctorRoom || !consultationFee) {
        toast.error("Please fill doctor-specific fields!");
        return false;
      }

      // Validate schedule
      for (let i = 0; i < schedule.length; i++) {
        const { day, startTime, endTime } = schedule[i];
        if (!day || !startTime || !endTime) {
          toast.error(`Please fill day, start and end time for slot #${i + 1}`);
          return false;
        }

        // Validate time logic
        if (startTime >= endTime) {
          toast.error(`End time must be after start time for slot #${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token missing. Please log in again.");
      router.push("/login");
      return;
    }

    const data = new FormData();

    // Append all form data
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "doctorInfo" && role === "doctor") {
        data.append("doctorInfo", JSON.stringify(formData[key]));
      } else if (key !== "doctorInfo") {
        data.append(key, value);
      }
    });

    try {
      setLoading(true);
      const res = await updateUserProfile(selectedUser?._id, data, token);
      
      
        toast.success("User updated successfully!");
        
        const updatedUser = res.data || res;
        
        // Update respective state based on role
        if (role === "doctor") {
          setDoctors((prev) => prev.map((d) => (d._id === updatedUser._id ? updatedUser : d)));
        } else if (role === "receptionist") {
          setReceptionists((prev) => prev.map((r) => (r._id === updatedUser._id ? updatedUser : r)));
        } else {
          setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
        }

        onClose();
      
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
  };

  // Close modal on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90vw] max-w-2xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-2xl font-bold text-blue-600">
            {selectedUser ? "Edit" : "Add New"} 
            <span className="text-blue-600 ml-2">{role?.charAt(0).toUpperCase() + role.slice(1)}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Common Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth?.split("T")[0]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>

              {/* Profile Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border"
                      />
                      <button
                        type="button"
                        onClick={clearImagePreview}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                      <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-sm text-gray-600">
                        {imagePreview ? "Change image" : "Upload profile image"}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Fields */}
          {role === "doctor" && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="doctorInfo.specialization"
                    value={formData.doctorInfo.specialization}
                    onChange={handleChange}
                    placeholder="e.g., Cardiologist"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room *
                  </label>
                  <select
                    name="doctorInfo.doctorRoom"
                    value={formData.doctorInfo.doctorRoom}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
          
                    {rooms.map(
                      (room) =>
                        room.status === "available" && (
                          <option key={room._id} value={room._id}>
                            {room.name || `Room ${room.roomNumber}`}
                          </option>
                        )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    name="doctorInfo.experience"
                    value={formData.doctorInfo.experience}
                    onChange={handleChange}
                    placeholder="Years of experience"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Fee *
                  </label>
                  <input
                    type="number"
                    name="doctorInfo.consultationFee"
                    value={formData.doctorInfo.consultationFee}
                    onChange={handleChange}
                    placeholder="Fee amount"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Doctor Schedule Section */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">Weekly Schedule</h4>
                  <button
                    type="button"
                    onClick={addScheduleRow}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Slot
                  </button>
                </div>
                
                <div className="space-y-3">
                  {formData.doctorInfo.schedule.map((slot, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                        <select
                          value={slot.day}
                          onChange={(e) =>
                            handleScheduleChange(index, "day", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Day *</option>
                          {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) =>
                              handleScheduleChange(index, "startTime", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500 text-sm">to</span>
                          <input
                            type="time"
                            value={slot.endTime}
                            onChange={(e) =>
                              handleScheduleChange(index, "endTime", e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeScheduleRow(index)}
                        disabled={formData.doctorInfo.schedule.length === 1}
                        className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                        title="Remove time slot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                "Update User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;