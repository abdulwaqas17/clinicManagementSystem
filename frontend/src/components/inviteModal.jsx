"use client";
import { inviteUser } from "@/services/usersServices";
import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { useRoomContext } from "@/context/roomContext";

export function AddUserModal({
  isOpen,
  onClose,
  role,
  receptionists,
  setReceptionists,
  doctors,
  setDoctors,
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    date_of_birth: "",
    address: "",
    profileImage: null,
    // doctor-specific fields
    specialization: "",
    doctorRoom: "",
    experience: "",
    consultationFee: "",
    schedule: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
  });

  const { rooms } = useRoomContext();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedule = [...formData.schedule];
    updatedSchedule[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      schedule: updatedSchedule,
    }));
  };

  const addScheduleRow = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [
        ...prev.schedule,
        { day: "Monday", startTime: "09:00", endTime: "17:00" },
      ],
    }));
  };

  const removeScheduleRow = (index) => {
    if (formData.schedule.length > 1) {
      setFormData((prev) => ({
        ...prev,
        schedule: prev.schedule.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const payload =
        role === "doctor"
          ? {
              ...formData,
              role,
              doctorInfo: {
                specialization: formData.specialization,
                doctorRoom: formData.doctorRoom,
                experience: formData.experience,
                consultationFee: formData.consultationFee,
                schedule: formData.schedule,
              },
            }
          : { ...formData, role };

      const res = await inviteUser(payload, token);
      toast.success(res.message || `${role} invited successfully`);

      if (role === "doctor") {
        setDoctors([...doctors, res.user]);
      } else if (role === "receptionist") {
        setReceptionists([...receptionists, res.user]);
      }

      onClose();

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        date_of_birth: "",
        address: "",
        profileImage: null,
        specialization: "",
        doctorRoom: "",
        experience: "",
        consultationFee: "",
        schedule: [{ day: "Monday", startTime: "09:00", endTime: "17:00" }],
      });
    } catch (error) {
      toast.error(error.message || "Failed to invite user");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {role === "doctor" ? "Add New Doctor" : "Add New Receptionist"}
              </h2>
              <p className="text-sm text-gray-500">
                Fill in the details to invite a new {role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Information</span>
            </h3>

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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter first name"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Email *</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Phone *</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Date of Birth *</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>Address *</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Doctor-specific Fields */}
          {role === "doctor" && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <span>Professional Information</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization *
                  </label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cardiology, Neurology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned Room
                  </label>
                  <select
                    name="doctorRoom"
                    value={formData.doctorRoom}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a Room</option>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience (Years) *
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Years of experience"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span>Consultation Fee *</span>
                    </label>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Fee amount"
                    />
                  </div>
                </div>

                {/* Schedule Section */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span>Weekly Schedule</span>
                    </h4>
                    <button
                      type="button"
                      onClick={addScheduleRow}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Time Slot</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.schedule.map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <select
                          value={slot.day}
                          onChange={(e) =>
                            handleScheduleChange(index, "day", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {daysOfWeek.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        <span className="text-gray-500 text-sm">to</span>

                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />

                        <button
                          type="button"
                          onClick={() => removeScheduleRow(index)}
                          disabled={formData.schedule.length === 1}
                          className="p-2 text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Inviting...</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  <span>
                    Invite {role === "doctor" ? "Doctor" : "Receptionist"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
